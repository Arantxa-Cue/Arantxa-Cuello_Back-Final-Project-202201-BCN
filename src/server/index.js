require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const router = require("./routers/sessionsRouter");
const usersRouter = require("./routers/usersRouter");
const { notFoundError, generalError } = require("./middlewares/errors");

const app = express();

app.use(cors());

app.use(morgan("dev"));
app.use(express.json());
app.use(helmet());

app.use("/", router);
app.use("/users", usersRouter);

app.use(notFoundError);
app.use(generalError);

module.exports = app;
