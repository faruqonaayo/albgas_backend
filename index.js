import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

// My custom modules
import dotenvConfig from "./util/dotenvConfig.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";

dotenvConfig;

// creating express app
const app = express();
const PORT = process.env.PORT || 3000;

// connecting to the mongodb database
mongoose.connect(process.env.DB_CONNECTION_STRING, {
  dbName: process.env.DB_NAME,
});

// using body parser middleware to parse the JSON request body
app.use(bodyParser.json());

// using cors middleware to enable cross origin requests
app.use(cors());

// my routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

// invalid route middleware
app.use((req, res, next) => {
  return res.status(404).json({ message: "Invalid route", statusCode: 404 });
});

// error handling middleware
app.use((error, req, res, next) => {
  console.log(error.message);
  console.log(error);
  return res.status(500).json({ message: "Server error", statusCode: 500 });
});

// express app listinng on a port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
