import mongoose from "mongoose"

export async function connectDatabase(): Promise<void> {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is required")
  }

  await mongoose.connect(uri)
  console.log("✅ Connected to MongoDB")
}
