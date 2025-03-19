const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "accounts",
  },
  language: {
    type: String,
    required: true,
  },
  word: {
    type: String,
    required: true,
  },
});

module.exports = wordSchema;
