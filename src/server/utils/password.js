const bcrypt = require("bcrypt");

const salt = 10;
const encryptPassword = async (password) => bcrypt.hash(password, salt);

module.exports = encryptPassword;
