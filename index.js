const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

const path = require("path");
const fs = require("fs");
require("dotenv").config(); // Load .env variables

const cors = require("cors");
const expressLayouts = require("express-ejs-layouts");
const ejs = require("ejs");
const sassMiddleware = require("sass-middleware");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const flash = require("connect-flash");

const viewHelpers = require("./config/view-helpers")(app);
const env = require("./config/environment");
const db = require("./config/mongoose");
const route = require("./routes/index");
const customMiddleware = require("./config/middleware");
const passportLocal = require("./config/passport-local-strategy");
const passportGoogle = require("./config/passport-google-oauth2-strategy");

// Middleware - CORS
app.use(cors());

// Middleware - SASS (only in development)
if (env.name === "development") {
	app.use(
		sassMiddleware({
			src: path.join(__dirname, env.asset_path, "scss"),
			dest: path.join(__dirname, env.asset_path, "css"),
			debug: false,
			outputStyle: "extended",
			prefix: "/css",
		})
	);
}

// Middleware - Encoders
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Static Files
app.use(express.static(env.asset_path));
app.use("/storage", express.static(__dirname + "/storage"));
app.use("/uploads", express.static(__dirname + "/uploads"));

// View Engine
app.use(expressLayouts);
app.use(logger(env.morgan.mode, env.morgan.options));
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ Session Setup with MongoStore (corrected)
app.use(
	session({
		name: "PlacementCellApplication",
		secret: env.session_cookie_key,
		saveUninitialized: false,
		resave: false,
		cookie: {
			maxAge: 1000 * 60 * 100, // 100 minutes
		},
		store: MongoStore.create({
			mongoUrl: process.env.MONGO_URI,
			autoRemove: "disabled",
		}),
	})
);

// ✅ Debug log (optional - remove later)
console.log("🔗 MongoDB URI:", process.env.MONGO_URI);

// PassportJS
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// Flash Messages
app.use(flash());
app.use(customMiddleware.setFlash);
app.use(customMiddleware.createFolders);

// Routes
app.use("/", route);

// Server
app.listen(port, (err) => {
	if (err) return console.log("Error:", err);
	console.log(`🚀 Server is running successfully on port ${port}`);
});
