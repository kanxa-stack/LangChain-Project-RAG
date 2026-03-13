import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";


import { createClient } from '@supabase/supabase-js'
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

import fs from 'fs';
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import dotenv from 'dotenv'
dotenv.config();

const supaBaseAPI = process.env.SB_API_KEY;
const supaBaseURL = process.env.SB_URI;

console.log("URL0:",supaBaseAPI, supaBaseURL)
const huggingFaceAPI = process.env.HF_API_KEY;

try {
    

    const data = fs.readFileSync("scrimba-info.txt", "utf8");
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        separators : ['\n\n', '\n',' ', ''], //by default
        chunkOverlap: 50
    });
    const output = await splitter.createDocuments([data])

    //Clent means creating connection to database
    const client = createClient(supaBaseURL, supaBaseAPI);

    const result = await SupabaseVectorStore.fromDocuments(
        output,
        new HuggingFaceInferenceEmbeddings({
            model: "sentence-transformers/all-MiniLM-L6-v2",
            apiKey: huggingFaceAPI, // Required for HF Inference API
        }),
        {
            client: client,
            tableName: "documents",
        }
        
);
console.log(result)

} catch (error) {
    console.warn("Error Ayo", error)
}
