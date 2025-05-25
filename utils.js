import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT_SECRET;
const exipre_time = process.env.JWT_EXPIRATION;
export const generateToken = (user) => {
  console.log('time', exipre_time);
  return jwt.sign({ id: user._id, email: user.email,role:user.role }, process.env.JWT_SECRET, {
    expiresIn: exipre_time,
  });
};
export const verifyToken = (token) => {
  console.log("verifying token", token);
  console.log("secret", secret);
   const res = jwt.verify(token, secret)
  console.log("res", res);
  return res;
};
