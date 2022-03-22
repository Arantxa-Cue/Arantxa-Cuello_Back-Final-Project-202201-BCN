require("dotenv").config();
const debug = require("debug")("mindfulness:server");
const chalk = require("chalk");
const Session = require("../../database/models/Session");
const User = require("../../database/models/User");
const notFoundError = require("../middlewares/errors");

const getAllSessions = async (req, res) => {
  const sessions = await Session.find();
  res.json({ sessions });
};

const deleteSession = async (req, res, next) => {
  const { id } = req.params;
  try {
    const session = await Session.findByIdAndDelete(id);

    if (session) {
      res.status(200).json({});
    } else {
      const error = new Error("Session not found");
      error.code = 404;
      next(error);
    }
  } catch (error) {
    error.message = new Error("Session not deleted");
    error.code = 400;
    next(error);
  }
};

const createSession = async (req, res, next) => {
  try {
    const newSession = req.body;

    const addNewSession = await Session.create(newSession);

    const user = await User.findById(req.userId);
    user.sessions.push(addNewSession.id);
    user.save();

    res.status(201);
    res.json(addNewSession);
  } catch (error) {
    next(error);
  }
};

const detailSession = async (req, res, next) => {
  const { id } = req.params;
  try {
    const session = await Session.findById(id);
    if (session) {
      debug(chalk.green("Session ok"));
      res.json(session);
    } else {
      debug(chalk.red("Session not found"));
      next(notFoundError);
    }
  } catch (error) {
    next(error);
  }
};

const updateSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sessionToUpdate = req.body;
    const updatedSession = await Session.findByIdAndUpdate(id, sessionToUpdate);
    if (sessionToUpdate) {
      res.status(201).json(updatedSession);
    } else {
      const error = new Error("Session not found");
      error.code = 404;
      next(error);
    }
  } catch (error) {
    error.code = 500;
    error.message = "Couldn't update session";
    next(error);
  }
};
module.exports = {
  getAllSessions,
  deleteSession,
  createSession,
  detailSession,
  updateSession,
};
