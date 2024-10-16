import { body } from "express-validator";

const validatorArray = [
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
];

export default validatorArray;
