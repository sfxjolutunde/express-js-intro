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
    it("should return a specific user by email", async () => {
      req.query.email = "test@yopmail.com";
      const mockUser = {
        firstName: "test",
        lastName: "User",
        email: "test@yopmail.com",
        role: "user",
      };
      UsersModel.find.mockResolvedValue([mockUser]); // <-- return an array
      await getAllUsers(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([mockUser]); // <-- expect an array
    });

    it("should return all users with a given limit ", async () => {
      req.query.limit = 3;
      const mockUsers = [{}, {}, {}];
      UsersModel.find.mockReturnValue({
        limit: jest.fn().mockResolvedValue(mockUsers),
      });
      await getAllUsers(req, res);
      expect(UsersModel.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "users fetched Successfully",
        usersResponse: mockUsers,
      });
    });

    it("should return all users without a limit been passed", async () => {
      const mockUsers = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];

      UsersModel.find.mockReturnValue({
        limit: jest.fn().mockResolvedValue(mockUsers),
      });
      await getAllUsers(req, res);

      expect(UsersModel.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "users fetched Successfully",
        usersResponse: mockUsers,
      });
    });

    it("should return empty array if no user with the given email", async () => {
      req.query.email = "test@yopmail.com";
      UsersModel.find.mockResolvedValue([]);
      const result = await getAllUsers(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
      expect(result).toBe(undefined);
    });

    it("should return empty array if no users exist", async () => {
      const mockUser = [];
      UsersModel.find.mockReturnValue({
        limit: jest.fn().mockResolvedValue(mockUser),
      });
      await getAllUsers(req, res);
      expect(UsersModel.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "No users found",
      });
    });
  });

  describe("SignUp", () => {
    it("should return error if firstName, lastName or email is missing", async () => {
      req.body = { firstName: "", lastName: "Doe", email: "test@yopmail.com" };
      const error = new Error("First Name, Last Name and Email are required!");
      error.status = 400;
      await signUp(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should return error if password is missing", async () => {
      req.body = {
        firstName: "John",
        lastName: "Doe",
        email: "test@yopmail.com",
      };
      const error = new Error("Password is missing!");
      error.status = 400;
      await signUp(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });

    it("should return error if email already exists", async () => {
      req.body = {
        firstName: "John",
        lastName: "Doe",
        email: "test@yopmail.com",
        password: "password123",
      };
      UsersModel.findOne.mockResolvedValue({
        email: req.body.email,
      });
      const error = new Error("Email already exists!");
      error.status = 400;
      await signUp(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
    
    it("should create a new user and return success response", async () => {
      req.body = {
        firstName: "John",
        lastName: "Doe",
        email: "test@yopmail.com",
        password: "password@123",
      };

      const mockUser = {
        firstName: "John",
        lastName: "Doe",
        email: "test@yopmail.com",
        role: "user",
      };
      bcrypt.hash.mockResolvedValue("hashedPassword");
      UsersModel.findOne.mockResolvedValue(null);
      UsersModel.create.mockResolvedValue(mockUser);

      await signUp(req, res, next);

      expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10);
      expect(UsersModel.findOne).toHaveBeenCalledWith({
        email: req.body.email,
      });
      expect(UsersModel.create).toHaveBeenCalledWith({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: "hashedPassword",
        role: "user",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Blog created successfully",
        savedUser: {
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          email: mockUser.email,
          role: mockUser.role,
        },
      });
    });
  });
});
