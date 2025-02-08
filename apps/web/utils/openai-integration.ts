import { ChatOpenAI } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import { getPrompt } from "./prompt";
import { pinecone } from "./pinecone-client";
import { cookies } from "next/headers"; // Import cookies

import { Pinecone } from "@pinecone-database/pinecone";

const PINECONE_INDEX_NAME = "openai-indexing";
// Get API key from cookies
const getApiKey = async () => {
  const cookieStore = await cookies();
  return cookieStore.get('apiKey')?.value;
};

export const analyzeEntryWithOpenAI = async (entry: string) => {
  const cookieStore =await cookies();
  const apiKey =  cookieStore.get("apiKey")?.value;

  if (!apiKey) {
    throw new Error("API key is missing in cookies.");
  }

  const input = await getPrompt(entry);
  const model = new ChatOpenAI({
    temperature: 0,
    modelName: "gpt-3.5-turbo",
    openAIApiKey: apiKey, // Pass API key dynamically
  });
  const output = await model.invoke(input);
  //@ts-expect-error output.content is a string which consists of the json but somehow does not understand that
  const jsonString = output.content.match(/```json\s*([\s\S]*?)\s*```/);
  if (!jsonString) {
    throw new Error("Failed to extract JSON from the output.");
  }
  const jsonObject = JSON.parse(jsonString[1]);
  console.log(jsonObject)
  return jsonObject;
};


const ensureIndex = async (pinecone: Pinecone, dimension = 1536) => { // 1536 for OpenAI embeddings
  const existingIndexes = (await pinecone.listIndexes()).indexes;
  const indexExists = existingIndexes?.some(
    (    index: { name: string; }) => index.name === PINECONE_INDEX_NAME
  );

  if (!indexExists) {
    console.log(`Creating new index: ${PINECONE_INDEX_NAME}`);
    await pinecone.createIndex({
      name: PINECONE_INDEX_NAME,
      dimension: dimension,
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-east-1'
        }
      }
    });
    
    while (true) {
      const description = await pinecone.describeIndex(PINECONE_INDEX_NAME);
      if (description.status.ready) break;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return pinecone.Index(PINECONE_INDEX_NAME);
};

// OpenAI Implementation (using text-embedding-3-small and gpt-3.5-turbo)
export const qaWithOpenAI = async (
  question: string,
  entries: Array<{ id: string; content: string }>,
  namespace?: string
) => {
  try {
    const openAIKey = await getApiKey();
    
    // Initialize OpenAI embeddings with the cheapest model
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: openAIKey,
      modelName: "text-embedding-3-small", // Cheapest embedding model
      dimensions: 1536,
      maxRetries: 3,
    });

    const index = await ensureIndex(pinecone, 1536);
    
    const pineconeStore = await PineconeStore.fromExistingIndex(
      embeddings,
      {
        pineconeIndex: index,
        namespace,
        textKey: "pageContent",
      }
    );

    const documents = entries.map((entry) => 
      new Document({
        pageContent: entry.content,
        metadata: {
          id: entry.id,
          date: new Date().toISOString(),
          source: "journal",
        },
      })
    );

    // Batch process
    const batchSize = 100;
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);
      await pineconeStore.addDocuments(batch);
    }

    const relevantDocs = await pineconeStore.similaritySearch(question, 5);

    if (relevantDocs.length === 0) {
      return {
        answer: "No relevant entries found for your question.",
        relevantEntries: []
      };
    }

    const context = relevantDocs
      .map((doc) => `Entry ID: ${doc.metadata.id}\nDate: ${doc.metadata.date}\nContent: ${doc.pageContent}`)
      .join("\n\n");

    // Initialize OpenAI chat with most cost-effective model
    const model = new ChatOpenAI({
      openAIApiKey: openAIKey,
      modelName: "gpt-3.5-turbo", // Most cost-effective model
      temperature: 0,
      maxTokens: 500, // Limit token usage
    });

    const prompt = `Based on these journal entries, please answer the question concisely:

Context:
${context}

Question: ${question}

Provide a direct answer using only the information in the entries.`;

    const result = await model.invoke(prompt);

    return {
      answer: result.content,
      relevantEntries: relevantDocs.map(doc => ({
        id: doc.metadata.id,
        date: doc.metadata.date
      }))
    };

  } catch (error) {
    console.error("Error in qaWithOpenAI:", error);
  }
};