import { getAllUsers, signUp, getOneUser, login } from "./user-controller.js";
import UsersModel from "../models/user-model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/utils.js";



jest.mock("../models/user-model.js");
jest.mock("bcrypt");
jest.mock("../utils/utils.js");

describe("user-controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, query: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("getAllUsers", () => {
    it("should return user by email", async () => {
      req.query.email = "test@example.com";
      const user = [{ email: "test@example.com" }];
      UsersModel.find.mockResolvedValue(user);

      await getAllUsers(req, res);

      expect(UsersModel.find).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(user);
    });

    it("should return all users with limit", async () => {
      req.query.limit = 2;
      const users = [{}, {}];
      UsersModel.find.mockReturnValue({ limit: jest.fn().mockResolvedValue(users) });

      await getAllUsers(req, res);

      expect(UsersModel.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "users fetched Successfully",
        usersResponse: users,
      });
    });
  });

  describe("signUp", () => {
    beforeEach(() => {
      req.body = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password123",
      };
    });

    it("should return error if required fields are missing", async () => {
      req.body.firstName = "";
      await signUp(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining("First Name, Last Name and Email is missing!") }));
    });

    it("should return error if password is missing", async () => {
      req.body.password = "";
      await signUp(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: "Password is missing!" }));
    });

    it("should return error if email already exists", async () => {
      UsersModel.findOne.mockResolvedValue({ email: "john@example.com" });
      bcrypt.hash.mockResolvedValue("hashedPassword");
      await signUp(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: "Email already exists!" }));
    });

    it("should create user and return success", async () => {
      UsersModel.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashedPassword");
      UsersModel.create.mockResolvedValue({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        role: "user",
      });

      await signUp(req, res, next);

      expect(UsersModel.create).toHaveBeenCalledWith(expect.objectContaining({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "hashedPassword",
        role: "user",
      }));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Blog created successfully",
        savedUser: {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          role: "user",
        },
      });
    });
  });

  describe("getOneUser", () => {
    it("should return user by id", async () => {
      req.params.id = "123";
      const user = { _id: "123", email: "test@example.com" };
      UsersModel.findById.mockResolvedValue(user);

      await getOneUser(req, res, next);

      expect(UsersModel.findById).toHaveBeenCalledWith("123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(user);
    });

    it("should return error if user not found", async () => {
      req.params.id = "123";
      UsersModel.findById.mockResolvedValue(null);

      await getOneUser(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: "User not found!" }));
    });
  });

  describe("login", () => {
    beforeEach(() => {
      req.body = { email: "john@example.com", password: "password123" };
    });

    it("should return error if email or password missing", async () => {
      req.body.email = "";
      await login(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: "Email or Password is missing!" }));
    });

    it("should return error if user not found", async () => {
      UsersModel.findOne.mockResolvedValue(null);
      await login(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining("not found") }));
    });

    it("should return error if password is incorrect", async () => {
      UsersModel.findOne.mockResolvedValue({ password: "hashed", email: "john@example.com" });
      bcrypt.compare.mockResolvedValue(false);
      await login(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: "Password is incorrect!" }));
    });

    it("should login and return token", async () => {
      const user = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "hashed",
      };
      UsersModel.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      generateToken.mockReturnValue("jwt-token");

      await login(req, res, next);

      expect(res.cookie).toHaveBeenCalledWith("token", "jwt-token", expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Login successful",
        token: "jwt-token",
        user: {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
        },
      });
    });
  });
});