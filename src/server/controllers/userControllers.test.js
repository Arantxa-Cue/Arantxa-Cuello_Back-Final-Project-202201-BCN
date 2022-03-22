const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");

const jsonwebtoken = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../../database/models/User");
const { loginUser, registerUser } = require("./usersControllers");
const connectDB = require("../../database");

jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"),
  sign: jest.fn().mockReturnValue("token"),
}));

let server;
beforeAll(async () => {
  server = await MongoMemoryServer.create();
  const uri = server.getUri();
  connectDB(uri);
});

beforeEach(async () => {
  const cryptPassword = await bcrypt.hash("1234", 10);
  await User.create({
    name: "leo",
    username: "leo",
    password: cryptPassword,
  });
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.stop();
});

describe("Given a loginUser controller", () => {
  describe("When it receives a response with valid username 'leo' and password '123'", () => {
    test("Then it should call json method of the received response", async () => {
      const password = "123";
      const salt = 10;
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = {
        username: "leo",
        password: hashedPassword,
      };
      const req = {
        body: {
          username: "leo",
          password,
        },
      };
      const res = {
        json: jest.fn(),
      };
      const token = "flkjakjdf";

      User.findOne = jest.fn().mockResolvedValue(user);
      jsonwebtoken.sign = jest.fn().mockResolvedValue(token);

      await loginUser(req, res);

      expect(res.json).toHaveBeenCalled();
    });
  });
  describe("When it receives an invalid user", () => {
    test("Then it should call next with error", async () => {
      const req = {
        body: {
          username: "leo",
          password: "kadjfkd",
        },
      };
      const next = jest.fn();

      User.findOne = jest.fn().mockResolvedValue(null);

      await loginUser(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
  describe("When it receives an invalid password", () => {
    test("Then it should call next with error", async () => {
      const req = {
        body: {
          username: "leo",
          password: "kadj",
        },
      };
      const next = jest.fn();

      User.findOne = jest.fn().mockResolvedValue(null);

      await loginUser(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given a user register controller", () => {
  describe("When it receives a request with valid data", () => {
    test("Then it should call methods status and json of next with registered user", async () => {
      const mockStatus = jest.fn().mockReturnThis();
      const mockJson = jest.fn();
      const res = { status: mockStatus, json: mockJson };

      const req = {
        body: {
          name: "leo",
          username: "leo",
          password: "123",
        },
      };

      const newUser = {
        name: "leo",
        username: "leo",
        password: "123",
      };

      User.findOne = jest.fn().mockResolvedValue(false);
      User.create = jest.fn().mockResolvedValue(newUser);

      await registerUser(req, res);

      expect(res.json).toHaveBeenCalledWith({
        name: "leo",
        username: "leo",
        password: "123",
      });
    });
  });
  describe("When error ocsurs", () => {
    test("Then the method next should be called", async () => {
      const user = {
        name: "leo",
        username: "leoo",
        password: 1234,
      };
      const res = null;
      const req = { body: user };
      const next = jest.fn();

      await registerUser(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
