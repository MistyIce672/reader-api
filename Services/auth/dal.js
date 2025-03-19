const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Account } = require("../../Schema");

require("dotenv").config();
const jwtSecretKey = process.env.SECRET_KEY;

// Function to generate random 6-digit code
function generatePairingCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to check if pairing code already exists
async function isPairingCodeUnique(code) {
  const existingAccount = await Account.findOne({ pairingCode: code });
  return !existingAccount;
}

// Generate unique pairing code
async function getUniquePairingCode() {
  let pairingCode;
  let isUnique = false;

  while (!isUnique) {
    pairingCode = generatePairingCode();
    isUnique = await isPairingCodeUnique(pairingCode);
  }

  return pairingCode;
}

async function createAccount(accountData) {
  try {
    // Generate unique pairing code
    const pairingCode = await getUniquePairingCode();

    // Add pairing code to account data
    const accountWithPairingCode = {
      ...accountData,
      pairingCode,
    };

    const newAccount = new Account(accountWithPairingCode);
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
