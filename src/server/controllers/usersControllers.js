require("dotenv").config();
const bcrypt = require("bcrypt");
const debug = require("debug")("mindfulness:usersControllers");
const chalk = require("chalk");
const jwt = require("jsonwebtoken");
const User = require("../../database/models/User");
const encryptPassword = require("../utils/password");

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    const error = new Error(chalk.redBright("Credentials are not correct"));
    error.code = 401;
    return next(error);
  }
  const isRightPassword = await bcrypt.compare(password, user.password);
  if (!isRightPassword) {
    const errorWrongPwd = new Error(
      chalk.redBright("Credentials are not correct")
    );
    errorWrongPwd.code = 401;
    return next(errorWrongPwd);
  }
  const userData = {
    name: user.name,
    id: user.id,
  };
  const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: "7d" });
  return res.json({ token });
};

const registerUser = async (req, res, next) => {
  const { name, username, password } = req.body;
  const user = await User.findOne({ username });
  if (!username || !password || user) {
    const errorWPW = new Error(
      chalk.redBright(`Oops..! Something went wrong.`)
    );
    errorWPW.code = 400;
    return next(errorWPW);
  }
  try {
    const encryptedPasword = await encryptPassword(password);
    const createdUser = await User.create({
      name,
      username,
      password: encryptedPasword,
    });
    debug(
      chalk.greenBright(`User ${username} has been successfully registered.`)
    );
    return res.status(201).json(createdUser);
  } catch (error) {
    return next(error);
  }
};

module.exports = { loginUser, registerUser };
