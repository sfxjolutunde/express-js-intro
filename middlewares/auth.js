import { verifyToken } from "../utils/utils.js";

export const protect = (req, res, next) => {
 const token = req.cookies.token 
 console.log("token", token);
  if (!token) {
    return res.status(401).json({error: "Unauthorized"});
  }


  try {
    const decoded = verifyToken(token);
    console.log("decoded", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("error", error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({error: "Token expired"});
    }else
    return res.status(403).json({error: "Invalid token"});
  }
};
