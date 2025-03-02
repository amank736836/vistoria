import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { connection: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.connection) {
    return cached.connection;
  }

  const opts = {
    bufferCommands: true,
    maxPoolSize: 10,
    retryWrites: false,
  };

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI)
      .then(() => mongoose.connection);
  }

  try {
    cached.connection = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw new Error("Error connecting to database: " + error);
  }

  return cached.connection;
}
