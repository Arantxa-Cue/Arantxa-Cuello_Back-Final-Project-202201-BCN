require("dotenv").config();
const Session = require("../../database/models/Session");

const getAllSessions = async (req, res) => {
  const sessions = await Session.find();
  res.json({ sessions });
};

const deleteSession = async (req, res, next) => {
  const { id } = req.params;
  try {
    const session = await Session.deleteOne({ id });
    if (session) {
      res.status(200).json({});
    } else {
      const error = new Error("Session not found");
      error.code = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllSessions, deleteSession };
