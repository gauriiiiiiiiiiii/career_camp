// Load environment variables
require("dotenv").config();

const path = require("path");
const fs = require("fs");
const rfs = require("rotating-file-stream");

// Create log directory if it doesn't exist
const logDirectory = path.join(__dirname, "../production_logs");
if (!fs.existsSync(logDirectory)) {
	fs.mkdirSync(logDirectory);
}

// Create rotating log stream (daily)
const accessLogStream = rfs.createStream("access.log", {
	interval: "1d",
	path: logDirectory,
});

// Development configuration
const development = {
	name: "development",
	asset_path: process.env.DEVELOPMENT_ASSET_PATH || "./assets",
	session_cookie_key: process.env.DEVELOPMENT_SESSION_COOKIE_KEY || "devSecretKey",
	db: process.env.DEVELOPMENT_DB || "mongodb://localhost:27017/devDB",
	db_name: process.env.DB_NAME || "devDB",
	deployment: process.env.DEPLOYMENT || "local",
	website_link: process.env.DEVELOPMENT_WEBSITE_LINK || "http://localhost:8000",
	google_client_id: process.env.GOOGLE_CLIENT_ID || "",
	google_client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
	google_callback_url: process.env.DEVELOPMENT_GOOGLE_CALLBACK_URL || "http://localhost:8000/users/auth/google/callback",
	morgan: {
		mode: "dev",
		options: { stream: accessLogStream },
	},
};

// Production configuration
const production = {
	name: "production",
	asset_path: process.env.ASSET_PATH || "./assets",
	session_cookie_key: process.env.SESSION_COOKIE_KEY || "prodSecretKey",
	db: process.env.MONGO_URI || process.env.DB, // Supports both keys
	db_name: process.env.DB_NAME || "prodDB",
	deployment: process.env.DEPLOYMENT || "render",
	website_link: process.env.WEBSITE_LINK || "https://your-live-domain.com",
	google_client_id: process.env.GOOGLE_CLIENT_ID || "",
	google_client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
	google_callback_url: process.env.GOOGLE_CALLBACK_URL || "https://your-live-domain.com/users/auth/google/callback",
	morgan: {
		mode: "combined",
		options: { stream: accessLogStream },
	},
};

// Final export (fallback to development)
const currentEnv = process.env.ENVIRONMENT || process.env.NODE_ENV || "development";
module.exports = currentEnv === "production" ? production : development;
