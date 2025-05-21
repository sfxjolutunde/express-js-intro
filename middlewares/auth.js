import jwt from "jsonwebtoken";
import { verifyToken } from "../utils.js";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];

  console.log("token", token);

  try {
    console.log('inside jwt verify')
    const decoded = verifyToken(token);
    console.log("decoded", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({error: "Invalid token or expired token"});
  }
};
