const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: "*",
  }),
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const authRoutes = require("./Services/auth/service");
const pageRoutes = require("./Services/pages/service");
const bookRoutes = require("./Services/books/service");
const fileRoutes = require("./Services/files/service");
const wordRoutes = require("./Services/words/service");
const translateRoutes = require("./Services/translate/service");

app.use("/api/auth", authRoutes);
app.use("/api/pages", pageRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/words", wordRoutes);
app.use("/api/translate", translateRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
