const Session = require("../../database/models/Session");
require("dotenv").config();

const getAllSessions = async (req, res) => {
  const sessions = await Session.find();
  res.json({ sessions });
};

module.exports = { getAllSessions };
