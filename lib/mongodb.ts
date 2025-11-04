import mongoose from 'mongoose';

// MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Global type augmentation for mongoose cache
 * This prevents TypeScript errors when accessing global.mongoose
 */
declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

/**
 * Cached mongoose connection object
 * In development, Next.js hot reloads can create multiple connections
 * This cache ensures we reuse the existing connection
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Establishes and returns a cached MongoDB connection
 * @returns Promise that resolves to a Mongoose connection
 */
async function dbConnect(): Promise<mongoose.Connection> {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create new connection promise if one doesn't exist
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false, // Disable buffering to fail fast on connection issues
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      return mongooseInstance.connection;
    });
  }

  try {
    // Wait for the connection to establish
    cached.conn = await cached.promise;
  } catch (e) {
    // Clear the promise on error so next call attempts a fresh connection
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
