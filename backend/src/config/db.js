import mongoose from 'mongoose';

// Serverless functions (Vercel) can invoke this on every cold start, and
// multiple function instances can run concurrently — without caching the
// connection promise, each invocation would open a new connection and
// quickly exhaust MongoDB Atlas's connection limit. `global` survives across
// invocations on a warm instance, so this reuses one connection (or one
// in-flight connection attempt) per instance instead.
let cached = global._mongooseConnection;
if (!cached) {
    cached = global._mongooseConnection = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(process.env.MONGO_URI).then((mongooseInstance) => {
            console.log('MongoDB connected');
            return mongooseInstance;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (err) {
        // Let the next invocation retry instead of reusing a rejected promise.
        cached.promise = null;
        throw err;
    }

    return cached.conn;
};

export default connectDB;
