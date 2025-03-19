const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { createAccount, loginUser } = require("./dal");

router.post("/signup", async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Validate required fields
    if (!username || !password || !email) {
      return res.status(400).json({
        error: "Username, password and email are required",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new account data
    const newAccountData = {
      username,
      password: hashedPassword,
      email,
      type: "user",
    };

    // Create account
    const createdAccount = await createAccount(newAccountData);

    res.status(201).json({
      _id: createdAccount._id,
      username: createdAccount.username,
      email: createdAccount.email,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({ error: error.message });
    } else {
      console.error("Error creating account:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // Authenticate user
    const token = await loginUser(email, password);
    if (token) {
      res.status(200).json({ token });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
