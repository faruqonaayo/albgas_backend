import mongodb from "mongodb";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";

// importing custom modules
import dotenvConfig from "../util/dotenvConfig.js";
import { verifyToken } from "../util/jwtoken.js";
dotenvConfig;

import User from "../models/user.js";

const MongoClient = new mongodb.MongoClient(process.env.DB_CONNECTION_STRING);

export async function getLocationProduction(req, res, next) {
  try {
    // checking if there is a token in the request header
    if (req.headers.authorization) {
      const headerToken = req.headers.authorization.split(":")[1];
      verifyToken(headerToken, async (result) => {
        if (!result) {
          return res.status(401).json({
            message: "Unauthorized",
            statusCode: 401,
          });
        } else {
          //   connecting to the mongodb database
          await MongoClient.connect();

          // getting the database
          const natGasDb = MongoClient.db(process.env.DB_NAME);

          // querying the database
          //   getting the result of the year that the user requested
          const result1 = await natGasDb.collection("natGasData").findOne({
            CSD: { $regex: req.query.location, $options: "i" },
            Period: `${req.query.year}`,
          });

          //   getting the result of the year before the year that the user requested

          const result2 = await natGasDb.collection("natGasData").findOne({
            CSD: { $regex: req.query.location, $options: "i" },
            Period: `${req.query.year - 1}`,
          });

          if (result1 && result2) {
            const location = result1.CSD;
            const production = result1.OriginalValue;
            const monthlyProduction = result1.OriginalValue / 12;
            const year = result1.Period;

            // calculating the change in production
            const productionLastYear = result2.OriginalValue;
            const productionChange = production - productionLastYear;
            const productionChangePercentage =
              (productionChange / productionLastYear) * 100;

            return res.status(200).json({
              message: "Success",
              statusCode: 200,
              data: {
                location,
                production,
                monthlyProduction,
                year,
                productionChangePercentage,
              },
            });
          } else if (result1) {
            const location = result1.CSD;
            const production = result1.OriginalValue;
            const monthlyProduction = result1.OriginalValue / 12;
            const year = result1.Period;

            // calculating the change in production

            const productionChangePercentage = (production / production) * 100;

            return res.status(200).json({
              message: "Success",
              statusCode: 200,
              data: {
                location,
                production,
                monthlyProduction,
                year,
                productionChangePercentage,
              },
            });
          } else {
            return res.status(404).json({
              message: "Data not found",
              statusCode: 404,
            });
          }
        }
      });
    } else {
      return res.status(401).json({
        message: "Unauthorized",
        statusCode: 401,
      });
    }
  } catch (error) {
    next(error);
  }
}

export function checkAuth(req, res, next) {
  // checking if there is a token in the request header
  if (req.headers.authorization) {
    const headerToken = req.headers.authorization.split(":")[1];
    verifyToken(headerToken, (result) => {
      if (result) {
        return res.status(200).json({
          message: "User is authorized",
          statusCode: 200,
        });
      } else {
        return res.status(401).json({
          message: "Unauthorized",
          statusCode: 401,
        });
      }
    });
  } else {
    return res.status(401).json({
      message: "Unauthorized",
      statusCode: 401,
    });
  }
}

export function getProfile(req, res, next) {
  // checking if there is a token in the request header
  if (req.headers.authorization) {
    const headerToken = req.headers.authorization.split(":")[1];
    verifyToken(headerToken, async (result) => {
      try {
        if (result) {
          // getting the user profile details from the database
          const user = await User.findOne({ _id: result.id });
          res.status(200).json({
            message: "Success",
            statusCode: 200,
            profile: {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
            },
          });
        } else {
          return res.status(401).json({
            message: "Unauthorized",
            statusCode: 401,
          });
        }
      } catch (error) {
        next(error);
      }
    });
  } else {
    return res.status(401).json({
      message: "Unauthorized",
      statusCode: 401,
    });
  }
}

export function updateProfile(req, res, next) {
  // checking if there is a token in the request header
  if (req.headers.authorization) {
    const headerToken = req.headers.authorization.split(":")[1];
    verifyToken(headerToken, async (result) => {
      try {
        if (result) {
          // checking if there are validation errors
          const { errors } = validationResult(req);
          if (errors.length > 0) {
            return res
              .status(422)
              .json({ message: errors[0], statusCode: 422 });
          } else {
            bcrypt.hash(req.body.password, 12, async (err, hashedPassword) => {
              if (err) {
                next(err);
              }

              // getting the user profile details from the database
              const user = await User.findOne({ _id: result.id });

              // checking if another user has the email sent in the request body
              const emailExists = await User.findOne({
                email: req.body.email.toLowerCase(),
              });

              if (
                emailExists &&
                user._id.toString() !== emailExists._id.toString()
              ) {
                return res.status(409).json({
                  message: "Email exists already",
                  statusCode: 409,
                });
              }

              // updating the user profile details in the database
              user.firstName = req.body.firstName;
              user.lastName = req.body.lastName;
              user.email = req.body.email;
              user.password = hashedPassword;

              await user.save();

              return res.status(200).json({
                message: "Profile updated successfully",
                statusCode: 200,
                profile: {
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                },
              });
            });
          }
        } else {
          return res.status(401).json({
            message: "Unauthorized",
            statusCode: 401,
          });
        }
      } catch (error) {
        next(error);
      }
    });
  } else {
    return res.status(401).json({
      message: "Unauthorized",
      statusCode: 401,
    });
  }
}
