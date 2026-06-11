import { MongoClient } from "mongodb";

let client: MongoClient;
let indexesReady = false;

export async function getDb() {
  if (!client) {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error("Missing MONGODB_URI");
    }

    client = new MongoClient(uri);
    await client.connect();
  }

  const db = client.db(process.env.MONGODB_DB ?? "stocksense");

  if (!indexesReady) {
    await Promise.all([
      db.collection("investment_reports").createIndex({ session_id: 1, created_at: -1 }),
      db.collection("bias_history").createIndex({ session_id: 1, created_at: -1 }),
      db.collection("watchlists").createIndex({ session_id: 1, created_at: -1 }),
    ]);
    indexesReady = true;
  }

  return db;
}
