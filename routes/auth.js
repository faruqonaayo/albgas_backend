import express from "express";

// importing my validators module
import registerValidator from "../validators/registerValidator.js";

// importing my controllers
import * as authControllers from "../controllers/auth.js";

// creating express router
const router = express.Router();

// defining routes

// route to register user
router.put("/register", registerValidator, authControllers.putRegisterUser);

// route to log users in
router.post("/login", authControllers.postLoginUser);

export default router;
