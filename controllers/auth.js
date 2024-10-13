import { validationResult } from "express-validator";
import bcrypt from "bcrypt";

// import User model
import User from "../models/user.js";

export async function putRegisterUser(req, res, next) {
  const { errors } = validationResult(req);

  // checking if error is present in the express validator middleware
  if (errors.length > 0) {
    return res.status(422).json({ message: errors, statusCode: 422 });
  }

  bcrypt.hash(req.body.password, 12, async (err, hashedPassword) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Server error", statusCode: 500 });
    }
    try {
      // creating the user object
      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender,
        dob: req.body.dob,
        email: req.body.email,
        occupation: req.body.occupation,
        addressProvince: req.body.addressProvince,
        address: req.body.address,
        password: hashedPassword,
      });

      // saving to db
      await newUser.save();

      // sending response
      return res
        .status(201)
        .json({ message: "User registered sucessfully", statusCode: 201 });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server error", statusCode: 500 });
    }
  });
}
