require("dotenv").config();
const express = require("express");
const { validate } = require("express-validation");

const {
  getAllSessions,
  deleteSession,
  createSession,
  detailSession,
  updateSession,
} = require("../controllers/sessionController");
const validationSessionJoi = require("../controllers/sessionValidator");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/allsessions", getAllSessions);
router.delete("/delete/:id", auth, deleteSession);
router.post(
  "/create",
  auth,

  validate(validationSessionJoi),
  createSession
);
router.get("/allsessions/session/:id", detailSession);
router.put("/edit/session/:id", auth, updateSession);

module.exports = router;
