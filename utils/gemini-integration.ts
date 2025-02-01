import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { Document } from "@langchain/core/documents";
import { getPrompt } from "./prompt";
import { pinecone } from "./pinecone-client";
import { cookies } from "next/headers";

// Get API key from cookies
const getApiKey = async () => {
  const cookieStore = await cookies();
  return cookieStore.get('apiKey')?.value;
};

export const analyzeEntryWithGemini = async (entry: string) => {
  const apiKey = await getApiKey();
  
  const model = new ChatGoogleGenerativeAI({
    apiKey,
    modelName: "gemini-1.0-pro", // Free Gemini model
    temperature: 0,
  });

  const input = await getPrompt(entry);
  const output = await model.invoke(input);
  return output;
};

export const qaWithGemini = async (question: string, entries: Array<{ id: string; content: string }>) => {
  const apiKey =await  getApiKey();

  // Initialize Gemini embeddings
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey,
    modelName: "models/embedding-001", // Free embedding model
  });

  // Use existing Pinecone client
  const pineconeStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: pinecone.Index("your-index-name"),
  });

  const documents = entries.map((entry) => 
    new Document({
      pageContent: entry.content,
      metadata: {
        id: entry.id,
        date: new Date().toISOString(),
      },
    })
  );

  await pineconeStore.addDocuments(documents);

  const relevantDocs = await pineconeStore.similaritySearch(question, 5);

  const model = new ChatGoogleGenerativeAI({
    apiKey,
    modelName: "gemini-1.0-pro",
    temperature: 0,
  });

  const result = await model.invoke(
    `Based on the following documents, answer the question:\n${relevantDocs
      .map((doc) => doc.pageContent)
      .join("\n\n")} \n\nQuestion: ${question}`
  );

  return result;
};