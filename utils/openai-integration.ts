import { OpenAI } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import { getPrompt } from "./prompt";
import { pinecone } from "./pinecone-client";
import { cookies } from "next/headers"; // Import cookies

export const analyzeEntryWithOpenAI = async (entry: string) => {
  const cookieStore =await cookies();
  const apiKey =  cookieStore.get("apiKey")?.value;

  if (!apiKey) {
    throw new Error("API key is missing in cookies.");
  }

  const input = await getPrompt(entry);
  const model = new OpenAI({
    temperature: 0,
    modelName: "gpt-4",
    openAIApiKey: apiKey, // Pass API key dynamically
  });
  const output = await model.call(input);
  console.log(typeof(output))
  return JSON.parse(output);
};

export const qaWithOpenAI = async (question: string, entries: Array<{ id: string; content: string }>) => {
  const cookieStore =await  cookies();
  const apiKey = cookieStore.get("apiKey")?.value;

  if (!apiKey) {
    throw new Error("API key is missing in cookies.");
  }

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: apiKey, // Pass API key to embeddings
  });

  const pineconeStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: pinecone.Index("openai-indexing"),
  });

  // Create Document objects with metadata
  const documents = entries.map((entry) =>
    new Document({
      pageContent: entry.content,
      metadata: {
        id: entry.id,
        date: new Date().toISOString(),
      },
    })
  );

  // Add documents using the new syntax
  await pineconeStore.addDocuments(documents);

  const relevantDocs = await pineconeStore.similaritySearch(question, 5);
  const model = new OpenAI({
    temperature: 0,
    modelName: "gpt-4",
    openAIApiKey: apiKey, // Pass API key dynamically
  });

  const result = await model.call(
    `Based on the following documents, answer the question:\n${relevantDocs
      .map((doc) => doc.pageContent)
      .join("\n\n")} \n\nQuestion: ${question}`
  );

  return result;
};
