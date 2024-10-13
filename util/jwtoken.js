import jwt from "jsonwebtoken";

// My custom modules
import dotenvConfig from "../util/dotenvConfig.js";

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
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err || !decoded || decoded.exp < Date.now()) {
      return cb(false);
    } else {
      return cb(decoded);
    }
  });
}
