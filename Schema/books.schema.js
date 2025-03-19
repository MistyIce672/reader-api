const mongoose = require("mongoose");

// Define the schema for the 'books' collection
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  file: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "files",
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "accounts",
  },
  pageNumber: {
    type: Number,
    required: true,
    default: 1,
  },
  originalLanguage: {
    type: String,
    required: true,
  },
  translatedLanguage: {
    type: String,
    required: true,
  },
  newWords: {
    type: Number,
    required: true,
  },
});

module.exports = bookSchema;
