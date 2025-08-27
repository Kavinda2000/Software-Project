import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        // Check if MONGO_URI exists
        if (!process.env.MONGO_URI) {
            console.log("⚠️  MONGO_URI environment variable not found");
            console.log("📝 Please create a .env file with your MongoDB connection string");
            console.log("🔧 Example: MONGO_URI=mongodb://localhost:27017/bifix");
            console.log("🚀 Server will continue running without database connection");
            return;
        }

        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`)
        console.log("🔧 Server will continue running without database connection")
        console.log("📝 To fix this, please:")
        console.log("   1. Check your MongoDB connection string")
        console.log("   2. Ensure MongoDB is running")
        console.log("   3. Check your internet connection if using MongoDB Atlas")
        console.log("   4. Create a .env file with MONGO_URI=mongodb://localhost:27017/bifix for local development")
        
        // Don't exit the process, just log the error and continue
        // process.exit(1) // Commented out to prevent server crash
    }
}