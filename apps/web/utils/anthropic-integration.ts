import { ChatAnthropic } from "@langchain/anthropic";
import { Document } from "@langchain/core/documents";
import { PineconeEmbeddings, PineconeStore } from "@langchain/pinecone";
import type { Pinecone } from "@pinecone-database/pinecone";
import { cookies } from "next/headers";
import { pinecone } from "./pinecone-client";
import { getPrompt } from "./prompt";

const PINECONE_INDEX_NAME = "anthropic-indexing";

// Get API key from cookies
const getApiKey = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("apiKey")?.value;
};

export const analyzeEntryWithAnthropic = async (entry: string) => {
  const apiKey = await getApiKey();

  const model = new ChatAnthropic({
    anthropicApiKey: apiKey,
    modelName: "claude-3-sonnet-20240229", // One of the cheaper Claude models
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

const ensureIndex = async (pinecone: Pinecone, dimension = 1536) => {
  const existingIndexes = (await pinecone.listIndexes()).indexes;
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
          region: "us-east-1",
        },
      },
    });

    while (true) {
      const description = await pinecone.describeIndex(PINECONE_INDEX_NAME);
      if (description.status.ready) break;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return pinecone.Index(PINECONE_INDEX_NAME);
};

// Anthropic Implementation (using Claude 3 Haiku)
export const qaWithAnthropic = async (
  question: string,
  entries: Array<{ id: string; content: string }>,
  namespace?: string,
) => {
  try {
    const anthropicKey = await getApiKey();

    const embeddings = new PineconeEmbeddings({
      model: "multilingual-e5-large",
    });

    // Ensure index exists before proceeding
    const index = await ensureIndex(pinecone);

    const pineconeStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace,
      textKey: "pageContent",
    });

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

    // Batch process with smaller batch size due to API limits
    const batchSize = 50;
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);
      await pineconeStore.addDocuments(batch);
    }

    const relevantDocs = await pineconeStore.similaritySearch(question, 5);

    if (relevantDocs.length === 0) {
      return {
        answer: "No relevant entries found for your question.",
        relevantEntries: [],
      };
    }

    const context = relevantDocs
      .map((doc) => `Entry ID: ${doc.metadata.id}\nDate: ${doc.metadata.date}\nContent: ${doc.pageContent}`)
      .join("\n\n");

    // Initialize Anthropic chat
    const model = new ChatAnthropic({
      anthropicApiKey: anthropicKey,
      modelName: "claude-3-haiku-20240307",
      temperature: 0,
      maxTokens: 500,
    });

    const prompt = `Based on these journal entries, please answer the question concisely:

Context:
${context}

Question: ${question}

Provide a direct answer using only the information in the entries.`;

    const result = await model.invoke(prompt);

    return {
      answer: result.content,
      relevantEntries: relevantDocs.map((doc) => ({
        id: doc.metadata.id,
        date: doc.metadata.date,
      })),
    };
  } catch (error) {
    console.error("Error in qaWithAnthropicDirect:", error);
  }
};
