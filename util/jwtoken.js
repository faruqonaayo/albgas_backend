import jwt from "jsonwebtoken";

// My custom modules
import dotenvConfig from "../util/dotenvConfig.js";

// importing user model
import User from "../models/user.js";

// getting secret key from .env file
dotenvConfig;

export function generateToken(payload, expiryInMin, cb) {
  jwt.sign(
    { ...payload, exp: expiryInMin * 60000 + Date.now() },
    process.env.JWT_SECRET,
    (err, token) => {
      if (err) {
        return cb(err);
      }
      return cb(token);
    }
  );
}

export function verifyToken(token, cb) {
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    try {
      if (err || !decoded || decoded.exp < Date.now()) {
        return cb(false);
      } else {
        // checking decoded token to see if the user exists in the database
        const userExists = await User.findOne({ _id: decoded.id });
        if (!userExists) {
          return cb(false);
        }
        return cb(decoded);
      }
    } catch (error) {
      return cb(false);
    }
  });
}
