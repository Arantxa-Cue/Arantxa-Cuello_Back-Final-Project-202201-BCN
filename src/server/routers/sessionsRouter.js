require("dotenv").config();
const express = require("express");

const {
  getAllSessions,
  deleteSession,
} = require("../controllers/sessionController");

const router = express.Router();

router.get("/allsessions", getAllSessions);
router.delete("/delete/:id", deleteSession);

module.exports = router;
