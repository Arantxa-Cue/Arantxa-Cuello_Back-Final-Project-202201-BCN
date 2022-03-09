const express = require("express");

const { getAllSessions } = require("../controllers/sessionController");

const router = express.Router();

router.get("/", getAllSessions);

module.exports = router;
