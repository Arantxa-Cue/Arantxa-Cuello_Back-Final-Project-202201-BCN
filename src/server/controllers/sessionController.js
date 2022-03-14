const Session = require("../../database/models/Session");
require("dotenv").config();

const getAllSessions = async (req, res) => {
  const sessions = await Session.find();
  res.json({ sessions });
};

const deleteSession = async (req, res, next) => {
  const { id } = req.params;
  try {
    const session = await Session.findByIdAndDelete(id);
    if (session) {
      res.json({ robot: { id } });
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
