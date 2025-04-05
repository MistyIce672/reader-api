const express = require("express");
const { authRoute } = require("../../Utils");
const {
  addKnownWords,
  getAllKnownWords,
  updateWordTranslate,
  deleteWord,
} = require("./dal");
const { translateWord } = require("../translation/dal");
const router = express.Router();

router.post("/translation", authRoute, async (req, res) => {
  try {
    const originalWord = req.body.word;
    const originalLanguage = req.body.originalLanguage;
    const translatedLanguage = req.body.translatedLanguage;
    const userId = req.user._id;

    const word = await translateWord(
      originalWord,
      originalLanguage,
      translatedLanguage,
      userId,
    );

    res.status(200).json({
      word,
    });
  } catch (error) {
    if (error.message === "Insufficient points") {
      return res.status(403).json({
        error: "Insufficient points for translation",
      });
    }
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

router.delete("/:wordId", authRoute, async (req, res) => {
  try {
    const { wordId } = req.params;
    const user_id = req.user._id;

    const deletedWord = await deleteWord(wordId, user_id);

    if (!deletedWord) {
      return res.status(404).json({
        error: "Word not found or you don't have permission to delete it",
      });
    }

    res.status(200).json({
      message: "Word deleted successfully",
      data: deletedWord,
    });
  } catch (error) {
    console.error("Error deleting word:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update word translate status
router.patch("/:wordId", authRoute, async (req, res) => {
  try {
    const { wordId } = req.params;
    const { translate } = req.body;
    const user_id = req.user._id;

    if (typeof translate !== "boolean") {
      return res.status(400).json({
        error: "translate field must be a boolean",
      });
    }

    const updatedWord = await updateWordTranslate(wordId, user_id, translate);

    if (!updatedWord) {
      return res.status(404).json({
        error: "Word not found or you don't have permission to update it",
      });
    }

    res.status(200).json({
      message: "Word updated successfully",
      data: updatedWord,
    });
  } catch (error) {
    console.error("Error updating word:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
