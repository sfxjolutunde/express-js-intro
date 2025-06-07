import UsersModel from "../models/user-model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/utils.js";

export const getAllUsers = async (req, res) => {
  let { email, limit } = req.query;
  if (email) {
    const user = await UsersModel.find({ email: email });
    res.status(200).json(user);
    return;
  }

  if(!limit || isNaN(limit) || limit <= 0) {
    limit = 10; // Default limit to 10 if not provided or invalid
  }
  const usersResponse = await UsersModel.find().limit(limit);
  if (!usersResponse || usersResponse.length === 0) {
    return res.status(404).json({ message: "No users found" });
  }
  res
    .status(200)
    .json({ message: "users fetched Successfully", usersResponse });

};

export const signUp = async (req, res, next) => {
  const newUser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role || "user", // Default role is 'user'
  };
  if (!newUser.firstName || !newUser.lastName || !newUser.email) {
    const err = new Error("First Name, Last Name and Email are required!");
    err.status = 400;
    return next(err);
  }

  if (!newUser.password) {
    const err = new Error("Password is missing!");
    err.status = 400;
    return next(err);
  }

  console.log("newUser password", newUser.password);
  // Hash the password
  const hashedPassword = await bcrypt.hash(newUser.password, 10);
  newUser.password = hashedPassword;

  const existingUser = await UsersModel.findOne({ email: newUser.email });
  if (existingUser) {
    const err = new Error("Email already exists!");
    err.status = 400;
    return next(err);
  }

  const savedUser = await UsersModel.create(newUser);

  res.status(201).json({
    message: "Blog created successfully",
    savedUser: {
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      email: savedUser.email,
      role: savedUser.role,
    },
  });
};

export const getOneUser = async (req, res, next) => {
  const user = await UsersModel.findById(req.params.id);
  if (!user) {
    const err = new Error("User not found!");
    err.status = 404;
    return next(err);
  }
  res.status(200).json(user);
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const err = new Error("Email or Password is missing!");
    err.status = 400;
    return next(err);
  }
  const user = await UsersModel.findOne({ email });
  if (!user) {
    const err = new Error(`User with email ${email} not found!`);
    err.status = 404;
    return next(err);
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("Password is incorrect!");
    err.status = 401;
    return next(err);
  }

  //generate jwt token
  const token = generateToken(user);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set to true in production for https
    sameSite: "Strict", // Adjust as needed
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.status(200).json({
    message: "Login successful",
    token,
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  });
};

// export const updateUserImage
