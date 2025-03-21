const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "accounts",
  },
  originalLanguage: {
    type: String,
    required: true,
  },
  translate: {
    type: Boolean,
    required: true,
  },
  originalWord: {
    type: String,
    required: true,
  },
  translatedLanguage: {
    type: String,
    required: true,
  },
  translatedWord: {
    type: String,
    required: true,
  },
});

module.exports = wordSchema;
