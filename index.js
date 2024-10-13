import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

// My custom modules
import dotenvConfig from "./util/dotenvConfig.js";
import authRoutes from "./routes/auth.js";

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

// my routes
app.use("/auth", authRoutes);

// express app listinng on a port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
