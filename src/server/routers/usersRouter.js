require("dotenv").config();
const express = require("express");
const {
  loginUser,
  registerUser,
  getProfile,
} = require("../controllers/usersControllers");

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/profile", getProfile);

module.exports = router;
