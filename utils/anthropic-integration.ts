import { ChatAnthropic } from "@langchain/anthropic";
import { OpenAIEmbeddings } from "@langchain/openai"; // Using OpenAI embeddings since Anthropic doesn't have embeddings
import { PineconeStore } from "@langchain/pinecone";
import { Document } from "@langchain/core/documents";
import { getPrompt } from "./prompt";
import { pinecone } from "./pinecone-client";
import { cookies } from "next/headers";

// Get API key from cookies
const getApiKey =async () => {
 const cookieStore =await cookies();
 return cookieStore.get('apiKey')?.value;
};

export const analyzeEntryWithAnthropic = async (entry: string) => {
 const apiKey =await getApiKey();
 
 const model = new ChatAnthropic({
   anthropicApiKey: apiKey,
   modelName: "claude-3-sonnet-20240229", // One of the cheaper Claude models
   temperature: 0,
 });

 const input = await getPrompt(entry);
 const output = await model.invoke(input);
 return output;
};

export const qaWithAnthropic = async (question: string, entries: Array<{ id: string; content: string }>) => {
 const apiKey =await getApiKey();

 // Using OpenAI embeddings since Anthropic doesn't provide embeddings
 const embeddings = new OpenAIEmbeddings({
   openAIApiKey: apiKey
 });

 // Use existing Pinecone client
 const pineconeStore = await PineconeStore.fromExistingIndex(embeddings, {
   pineconeIndex: pinecone.Index("your-index-name"),
 });

 // Create Document objects
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

 const model = new ChatAnthropic({
   anthropicApiKey: apiKey,
   modelName: "claude-3-sonnet-20240229",
   temperature: 0,
 });

 const result = await model.invoke(
   `Based on the following documents, answer the question:\n${relevantDocs
     .map((doc) => doc.pageContent)
     .join("\n\n")} \n\nQuestion: ${question}`
 );

 return result;
};