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

router.get("/:language/:translated", authRoute, async (req, res) => {
  try {
    const { language, translated } = req.params;
    const user_id = req.user._id; // Assuming you have user authentication middleware

    const knownWords = await getAllKnownWords(language, translated, user_id);

    res.status(200).json({
      data: knownWords,
    });
  } catch (error) {
    console.error("Error getting known words:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add new known words
router.post("/", authRoute, async (req, res) => {
  try {
    const {
      originalWord,
      translatedWord,
      originalLanguage,
      translatedLanguage,
      translate,
    } = req.body;

    const user_id = req.user._id;

    const addedWords = await addKnownWords(
      originalWord,
      translatedWord,
      originalLanguage,
      translatedLanguage,
      translate,
      user_id,
    );

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
