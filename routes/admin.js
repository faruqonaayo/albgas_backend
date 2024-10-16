import express from "express";

// importing my controllers
import * as adminControllers from "../controllers/admin.js";

// importing my middleware
import updateValidator from "../validators/updateValidator.js";

// creating express router
const router = express.Router();

// defining routes

// route to get a location production
router.get("/production", adminControllers.getLocationProduction);

// route to check if a user is authorized
router.get("/auth", adminControllers.checkAuth);

// route to get user profile details
router.get("/profile", adminControllers.getProfile);

// route to update user profile details
router.patch(
  "/profile/update",
  updateValidator,
  adminControllers.updateProfile
);

export default router;
