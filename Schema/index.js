const mongoose = require("mongoose");
const accountSchema = require("./accounts.schema");
const bookSchema = require("./books.schema");
const fileSchema = require("./file.schema");
const wordSchema = require("./words.schema");

const mongoToken = process.env.mongodb;
const connection = mongoose.createConnection(mongoToken);

const Account = connection.model("accounts", accountSchema);
const Book = connection.model("books", bookSchema);
const File = connection.model("files", fileSchema);
const Word = connection.model("words", wordSchema);

module.exports = {
  Account,
  Book,
  File,
  Word,
};
