const express = require("express");
const { authRoute } = require("../../Utils");
const { addKnownWords, getAllKnownWords } = require("./dal");
const { translateWord } = require("../books/dal");
const router = express.Router();

router.post("/translation", authRoute, async (req, res) => {
  try {
    const originalWord = req.body.word;
    const originalLanguage = req.body.originalLanguage;
    const translatedLanguage = req.body.translatedLanguage;

    const word = await translateWord(
      originalWord,
      originalLanguage,
      translatedLanguage,
    );

    res.status(200).json({
      word,
    });
  } catch (error) {
    console.error("Error getting known words:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:language", authRoute, async (req, res) => {
  try {
    const { language } = req.params;
    const user_id = req.user._id; // Assuming you have user authentication middleware

    const knownWords = await getAllKnownWords(language, user_id);

    res.status(200).json({
      data: knownWords,
    });
  } catch (error) {
    console.error("Error getting known words:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add new known words
router.post("/:language", authRoute, async (req, res) => {
  try {
    const { language } = req.params;
    const { words } = req.body;
    const user_id = req.user._id; // Assuming you have user authentication middleware

    if (!Array.isArray(words)) {
      return res
        .status(400)
        .json({ error: "Words must be provided as an array" });
    }

    const addedWords = await addKnownWords(words, language, user_id);

    res.status(201).json({
      message: "Words added successfully",
      data: addedWords,
    });
  } catch (error) {
    console.error("Error adding known words:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
