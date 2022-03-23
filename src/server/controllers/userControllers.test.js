const bcrypt = require("bcrypt");

const jsonwebtoken = require("jsonwebtoken");
const chalk = require("chalk");
const User = require("../../database/models/User");
const {
  loginUser,
  registerUser,
  getUserSessions,
} = require("./usersControllers");

beforeEach(() => {
  jest.resetAllMocks();
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
      const error = new Error(chalk.redBright("Credentials are not correct"));
      error.code = 401;

      await loginUser(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
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
  describe("When it receives a non existing user", () => {
    test("Then the method next should be called with error", async () => {
      const req = {
        body: {
          name: "",
          username: "",
          password: 1234,
        },
      };
      const res = {};
      const next = jest.fn();
      User.findOne = jest.fn().mockResolvedValue(false);
      const error = new Error("Oops..! Something went wrong.");
      error.code = 400;

      await registerUser(req, res, next);
      expect(User.findOne).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given a getUserSessions controller", () => {
  describe("When it receives an id", () => {
    test("Then it should call method jason with the users session", async () => {
      const req = {
        params: {
          id: "33",
        },
      };
      const expectedSessionToFind = {
        id: "33",
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();
      User.findById = jest.fn().mockReturnThis();

      User.populate = jest.fn().mockResolvedValue(expectedSessionToFind);
      await getUserSessions(req, res, next);

      expect(res.json).toHaveBeenCalled();
    });
  });
});
