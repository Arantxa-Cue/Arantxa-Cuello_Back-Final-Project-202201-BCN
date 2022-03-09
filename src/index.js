require("dotenv").config();
const debug = require("debug")("mindfulness:root");
const chalk = require("chalk");
const mindServidor = require("./server/server");
const app = require("./server/index");
const connectDatabase = require("./database/index");

const port = process.env.PORT || 5000;
const connectionString = process.env.MONGO_STRING;

(async () => {
  try {
    await connectDatabase(connectionString);
    await mindServidor(port, app);
  } catch (error) {
    debug(chalk.redBright(`Error: ${error.message}`));
  }
})();
