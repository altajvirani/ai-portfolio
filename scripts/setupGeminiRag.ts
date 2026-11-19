import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: ".env.local" });
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
  throw new Error("Set GEMINI_API_KEY in .env.local before running this setup.");
}

const ai = new GoogleGenAI({ apiKey });
const displayName = "Altaj Portfolio Resume RAG";
const pdfPath = path.resolve("public/assets/resume-altaj-virani.pdf");

const stores = await ai.fileSearchStores.list({ config: { pageSize: 100 } });
let store;
for await (const candidate of stores) {
  if (candidate.displayName === displayName) {
    store = candidate;
    break;
  }
}

if (!store) {
  store = await ai.fileSearchStores.create({
    config: {
      displayName,
      embeddingModel: "models/gemini-embedding-001",
    },
  });
}

if (!store.name) throw new Error("The Gemini File Search store did not return a name.");

const operation = await ai.fileSearchStores.uploadToFileSearchStore({
  fileSearchStoreName: store.name,
  file: pdfPath,
  config: {
    mimeType: "application/pdf",
    displayName: "resume-altaj-virani.pdf",
  },
});

for (let attempt = 0; attempt < 120 && !operation.done; attempt += 1) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const updated = await ai.operations.get({
    operation,
  });
  operation.done = updated.done;
  operation.error = updated.error;
  operation.response = updated.response as typeof operation.response;
}

if (!operation.done) throw new Error("The PDF import timed out.");
if (operation.error) throw new Error(`The PDF import failed: ${JSON.stringify(operation.error)}`);

console.log(`GEMINI_FILE_SEARCH_STORE_NAME=${store.name}`);
