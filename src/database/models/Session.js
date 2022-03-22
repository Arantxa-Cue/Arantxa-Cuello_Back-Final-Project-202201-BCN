const { model, Schema } = require("mongoose");

const SessionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  comment: {
    type: String,
    required: true,
  },
  iFrame: {
    type: String,
    required: true,
  },
});

const Session = model("Session", SessionSchema, "mindfulness");

module.exports = Session;
