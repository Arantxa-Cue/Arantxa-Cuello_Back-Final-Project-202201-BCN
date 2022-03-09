require("dotenv").config();
const debug = require("debug")("mindfulness:root");
const mindServidor = require("./server/server");
const connectDatabase = require("./database/index");
const app = require("./server/index");

const port = process.env.PORT || 4000;
const connectionString = process.env.MONGO_STRING;

(async () => {
  try {
    await connectDatabase(connectionString);
    await mindServidor(port, app);
    debug("Server working");
  } catch (error) {
    debug(`Error: ${error.message}`);
  }
})();
