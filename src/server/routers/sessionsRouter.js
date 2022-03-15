require("dotenv").config();
const express = require("express");
const { validate } = require("express-validation");

const {
  getAllSessions,
  deleteSession,
  createSession,
} = require("../controllers/sessionController");
const validationSessionJoi = require("../controllers/sessionValidator");

const router = express.Router();

router.get("/allsessions", getAllSessions);
router.delete("/delete/:id", deleteSession);
router.post("/create", validate(validationSessionJoi), createSession);

module.exports = router;
