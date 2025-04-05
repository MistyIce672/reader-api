const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Account } = require("../../Schema");

require("dotenv").config();
const jwtSecretKey = process.env.SECRET_KEY;

async function createAccount(accountData) {
  try {
    const newAccount = new Account(accountData);
    const savedAccount = await newAccount.save();

    return savedAccount;
  } catch (error) {
    console.error("Error creating account:", error);
    throw error;
  }
}

async function loginUser(email, password) {
  try {
    const user = await Account.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }
    const token = jwt.sign({ userId: user._id }, jwtSecretKey, {
      expiresIn: "30d",
    });
    return token;
  } catch (error) {
    console.error("Error during user authentication:", error);
    throw error;
  }
}

async function getUser(userId) {
  try {
    // Find user by ID and exclude the password field from the result
    const user = await Account.findById(userId).select("-password");

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

async function authenticateUser(token) {
  try {
    const data = jwt.verify(token, jwtSecretKey);
    const user = await Account.findOne({ _id: data.userId }).select(
      "-password",
    );
    return user;
  } catch (error) {
    throw new Error("Invalid Token");
  }
}

module.exports = { createAccount, loginUser, getUser, authenticateUser };
