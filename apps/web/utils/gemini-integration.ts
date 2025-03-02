import { Document } from "@langchain/core/documents";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import type { Pinecone } from "@pinecone-database/pinecone";
import { cookies } from "next/headers";
import { pinecone } from "./pinecone-client";
import { getPrompt } from "./prompt";

const PINECONE_INDEX_NAME = "gemini-indexing";
// Get API key from cookies
const getApiKey = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("apiKey")?.value;
};

export const analyzeEntryWithGemini = async (entry: string) => {
  const apiKey = await getApiKey();

  const model = new ChatGoogleGenerativeAI({
    apiKey,
    modelName: "gemini-2.0-flash", // Free Gemini model
    temperature: 0,
  });

  const input = await getPrompt(entry);
  const output = await model.invoke(input);
  //@ts-expect-error output.content is a string which consists of the json but somehow does not understand that
  const jsonString = output.content.match(/```json\s*([\s\S]*?)\s*```/);
  if (!jsonString) {
    throw new Error("Failed to extract JSON from the output.");
  }
  const jsonObject = JSON.parse(jsonString[1]);
  console.log(jsonObject);
  return jsonObject;
};

//for dealing with pinecone u need indexes
// Function to ensure index exists
const ensureIndex = async (pinecone: Pinecone, dimension = 768) => {
  // 768 is default for Gemini embeddings
  // List existing indexes
  const existingIndexes = (await pinecone.listIndexes()).indexes;

  // Check if our index exists
  const indexExists = existingIndexes?.some((index: { name: string }) => index.name === PINECONE_INDEX_NAME);

  if (!indexExists) {
    console.log(`Creating new index: ${PINECONE_INDEX_NAME}`);
    await pinecone.createIndex({
      name: PINECONE_INDEX_NAME,
      dimension: dimension,
      metric: "cosine",
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1", //free plan only supports this region -,-
        },
      },
    });

    // Wait for index to be ready
    while (true) {
      const description = await pinecone.describeIndex(PINECONE_INDEX_NAME);
      if (description.status.ready) break;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return pinecone.Index(PINECONE_INDEX_NAME);
};

export const qaWithGemini = async (
  question: string,
  entries: Array<{ id: string; content: string }>,
  namespace?: string,
) => {
  try {
    const apiKey = await getApiKey();

    // Initialize Gemini embeddings
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey,
      modelName: "models/embedding-001",
      maxRetries: 3,
    });

    // Ensure index exists before proceeding
    const index = await ensureIndex(pinecone);

    // Initialize Pinecone store with verified index
    const pineconeStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace,
      textKey: "pageContent",
    });

    // Create documents with metadata
    const documents = entries.map(
      (entry) =>
        new Document({
          pageContent: entry.content,
          metadata: {
            id: entry.id,
            date: new Date().toISOString(),
            source: "journal",
          },
        }),
    );

    // Batch process documents
    const batchSize = 100;
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);
      try {
        await pineconeStore.addDocuments(batch);
      } catch (error) {
        console.error(`Error adding batch ${i / batchSize + 1}:`, error);
        // Continue with next batch instead of failing completely
      }
    }

    // Perform similarity search
    const relevantDocs = await pineconeStore.similaritySearch(question, 5);

    if (relevantDocs.length === 0) {
      return {
        answer: "No relevant entries found for your question.",
        relevantEntries: [],
      };
    }

    // Prepare context
    const context = relevantDocs
      .map((doc) => {
        return `Entry ID: ${doc.metadata.id}\nDate: ${doc.metadata.date}\nContent: ${doc.pageContent}`;
      })
      .join("\n\n");

    // Initialize Gemini model
    const model = new ChatGoogleGenerativeAI({
      apiKey,
      modelName: "gemini-2.0-flash",
      temperature: 0,
      maxOutputTokens: 1024,
      topP: 0.8,
      topK: 40,
    });

    const prompt = `You are a helpful assistant analyzing journal entries. Based on the following journal entries, please answer the question accurately and concisely.

Context from relevant journal entries:
${context}

Question: ${question}

Please provide a clear and direct answer based only on the information present in the journal entries.`;

    const result = await model.invoke(prompt);

    return {
      answer: result.content,
      relevantEntries: relevantDocs.map((doc) => ({
        id: doc.metadata.id,
        date: doc.metadata.date,
      })),
    };
  } catch (error) {
    console.error("Error in qaWithGemini:", error);
  }
};
