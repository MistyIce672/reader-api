const { authenticateUser } = require("../Services/auth/dal");

async function authRoute(req, res, next) {
  try {
    // Get the auth header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const user = await authenticateUser(authHeader);
    if (!authHeader) {
      return res.status(401).json({ error: "invalid auth token" });
    }
    req.user = user;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    console.error("Auth middleware error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  authRoute,
};
