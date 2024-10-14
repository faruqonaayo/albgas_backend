import express from "express";

// importing my controllers
import * as adminControllers from "../controllers/admin.js";

// creating express router
const router = express.Router();

// defining routes

// route to get a location production
router.get("/production", adminControllers.getLocationProduction);

// rout to check if a user is authorized
router.get("/auth", adminControllers.checkAuth);

export default router;
