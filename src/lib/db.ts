import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_LOCAL_URI

const dbConnect = async () => {

  if (!MONGODB_URI) {
    throw new Error("MongoDB URI not found in environment variables")
  }

  try {
    await mongoose.connect(MONGODB_URI)
    console.log("MongoDB connected")
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw error
  }
}

export default dbConnect