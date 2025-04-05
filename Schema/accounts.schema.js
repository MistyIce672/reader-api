const mongoose = require("mongoose");

// Define the schema for the 'accounts' collection
const accountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  points: {
    type: Number,
    required: true,
    default: 10000,
  },
  wall_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

module.exports = accountSchema;
