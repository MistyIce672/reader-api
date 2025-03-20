const express = require("express");
const { authRoute } = require("../../Utils");
const { getLanguages } = require("../books/dal");
const router = express.Router();

router.get("/languages", authRoute, async (req, res) => {
  try {
    const languages = await getLanguages();

    res.status(200).json({
      languages,
    });
  } catch (error) {
    console.error("Error getting languages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
