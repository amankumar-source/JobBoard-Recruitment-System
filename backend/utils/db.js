import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            // Use the new URL parser and unified topology (required in production)
            serverSelectionTimeoutMS: 5000,  // Fail fast if MongoDB can't be reached
            socketTimeoutMS: 45000,          // Close sockets after 45s of inactivity
            maxPoolSize: 10,                 // Maximum connection pool size
        });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        throw error; // Propagate so index.js can handle it and exit cleanly
    }
};

export default connectDB;