import express from "express";

// importing my validators module
import validatorArray from "../validators/validators.js";

// importing my controllers
import * as authController from "../controllers/auth.js";

// creating express router
const router = express.Router();

// defining routes
router.put("/register", validatorArray, authController.putRegisterUser);

export default router;
