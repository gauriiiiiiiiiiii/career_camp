// Require the Mongoose Library
const mongoose = require("mongoose");
// Require the Environment File for getting the Environment Variables
const env = require("./environment");

// Connect to MongoDB
const connectDB = async () => {
	try {
		await mongoose.connect(env.db, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			serverSelectionTimeoutMS: 10000, // Prevents infinite wait
		});
		console.log("✅ Connected to MongoDB successfully");
	} catch (err) {
		console.error("❌ MongoDB connection error:", err);
		process.exit(1); // Exit process on DB failure
	}
};

connectDB();

// Export Mongoose connection (in case needed elsewhere)
module.exports = mongoose.connection;
