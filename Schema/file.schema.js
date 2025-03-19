const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  uploaded_on: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    required: true,
    default: "untagged",
  },
});

module.exports = fileSchema;
