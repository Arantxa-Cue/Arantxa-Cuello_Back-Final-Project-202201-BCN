const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../../database/models/User");
const { loginUser } = require("./usersControllers");

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
