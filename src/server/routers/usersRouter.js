require("dotenv").config();
const express = require("express");
const {
  loginUser,
  registerUser,
  getUserSessions,
} = require("../controllers/usersControllers");

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/profile/user", getUserSessions);

module.exports = router;
