import mongoose from 'mongoose'

// Defining the database connection string
// In production, use actual environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cpl'

// Cached connection for performance optimization across serverless functions
let cached = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

// Connect to MongoDB function
export async function connectToDatabase() {
  // If connection already exists, return it
  if (cached.conn) {
    return cached.conn
  }

  // If no promise exists, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: true
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

// Export mongoose for use in other files
export default mongoose
