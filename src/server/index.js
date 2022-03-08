const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(helmet());
