import express from "express";
import jwt from "jsonwebtoken";
import { body } from "express-validator";

// importing my controllers
import * as authController from "../controllers/auth.js";

// creating express router
const router = express.Router();

// defining routes
router.put(
  "/register",
  [
    body("firstName")
      .trim()
      .isLength({ min: 2 })
      .withMessage("First Name should be a minimum of 2 characters"),
    body("lastName")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Last Name should be a minimum of 2 characters"),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Email must be a valid email address"),
    body("occupation")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Occuption should be a minimum of 2 characters"),
    body("dob").trim().isDate().withMessage("DOB should be a valid date"),
    body("addressProvince")
      .trim()
      .custom((value, { req }) => {
        if (
          value.toLowerCase() === "alberta" ||
          value.toLowerCase() === "british columbia" ||
          value.toLowerCase() === "manitoba" ||
          value.toLowerCase() === "new brunswick" ||
          value.toLowerCase() === "newfoundland and labrador" ||
          value.toLowerCase() === "northwest territories" ||
          value.toLowerCase() === "nova scotia" ||
          value.toLowerCase() === "nunavut" ||
          value.toLowerCase() === "ontario" ||
          value.toLowerCase() === "prince edward island" ||
          value.toLowerCase() === "quebec" ||
          value.toLowerCase() === "saskatchewan" ||
          value.toLowerCase() === "yukon"
        ) {
          return true;
        } else {
          return false;
        }
      })
      .withMessage("Address Province should be a valid Canadian province"),
    body("password")
      .trim()
      .isLength({ min: 7 })
      .withMessage("Password should be a minimum of 7 characters"),
    body("cPassword")
      .trim()
      .custom((value, { req }) => {
        if (value === req.body.password) {
          return true;
        } else {
          return false;
        }
      })
      .withMessage("Passwords do not match"),
  ],
  authController.putRegisterUser
);

export default router;
