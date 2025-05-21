import jwt from "jsonwebtoken";

const secret ="nextgen_academy";
const exipre_time = process.env.JWT_EXPIRATION;
export const generateToken = (user) => {
  console.log('time', exipre_time)
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};
console.log("secret", secret);
export const verifyToken = (token) => {
  console.log("secret", secret);
  return jwt.verify(token, secret);
};
