import { validationResult } from "express-validator";
import bcrypt from "bcrypt";

// importing my modules
import { generateToken, verifyToken } from "../util/jwtoken.js";

// import User model
import User from "../models/user.js";

// controller to register user
export async function putRegisterUser(req, res, next) {
  const { errors } = validationResult(req);

  // checking if error is present in the express validator middleware
  if (errors.length > 0) {
    return res.status(422).json({ message: errors, statusCode: 422 });
  }

  bcrypt.hash(req.body.password, 12, async (err, hashedPassword) => {
    if (err) {
      next(err);
    }
    try {
      // checking if user exists in db
      const userExists = await User.findOne({
        email: req.body.email.toLowerCase(),
      });

      if (userExists) {
        return res
          .status(409)
          .json({ message: "User exists already", statusCode: 409 });
      }

      // creating the user object
      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender.toLowerCase(),
        dob: req.body.dob,
        email: req.body.email.toLowerCase(),
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
      next(error);
    }
  });
}

// controller to log user in
export async function postLoginUser(req, res, next) {
  try {
    // chcking if there is a token in the request header
    // if (req.headers.authorization) {
    //   const headerToken = req.headers.authorization.split(":")[1];
    //   verifyToken(headerToken, (result) => {
    //     if (result) {
    //       return res.status(200).json({
    //         message: "User already logged in",
    //         statusCode: 200,
    //       });
    //     }
    //   });
    // }

    // checking if user exists in db
    const userExists = await User.findOne({
      email: req.body.email.toLowerCase(),
    });

    if (!userExists) {
      return res
        .status(404)
        .json({ message: "Invalid email or password", statusCode: 404 });
    }

    // comparing password
    bcrypt.compare(
      req.body.password,
      userExists.password,
      async (err, result) => {
        if (err) {
          next(err);
        } else if (!result) {
          return res
            .status(401)
            .json({ message: "Invalid password", statusCode: 401 });
        }
        // if user is found and password is correct

        // create a token to send to the user
        generateToken({ id: userExists._id }, 60, (token) => {
          if (!token) {
            return next(new Error("Error creating token"));
          }

          return res.status(200).json({
            message: "User logged in successfully",
            statusCode: 200,
            token: token,
          });
        });
      }
    );
  } catch (error) {
    next(error);
  }
}
