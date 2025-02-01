import { Pinecone } from '@pinecone-database/pinecone';

export const pinecone = new Pinecone({
  apiKey:process.env.PINCECONE_API_KEY||""
});

