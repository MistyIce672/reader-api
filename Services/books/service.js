const express = require("express");
const { authRoute } = require("../../Utils");
const {
  createBook,
  getBookById,
  getAllBooksByUserId,
  getCommonWords,
  translateContent,
  getKnownWords,
  updateCurrentPage,
} = require("./dal");
const router = express.Router();
const { getFile } = require("../files/dal");
const pdf = require("pdf-parse");

const extractPageContent = (pdfData, pageNum) => {
  const pages = pdfData.text.split("\n\n");
  return (pages[pageNum - 1] || "").replace(/\n/g, " ");
};

router.post("/", authRoute, async (req, res) => {
  try {
    const bookData = {
      title: req.body.title,
      file: req.body.file,
      originalLanguage: req.body.originalLanguage,
      translatedLanguage: req.body.translatedLanguage,
      newWords: req.body.newWords,
      user_id: req.user._id,
    };

    const newBook = await createBook(bookData);

    res.status(201).json({
      success: true,
      data: newBook,
      message: "Book created successfully",
    });
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
});

router.get("/", authRoute, async (req, res) => {
  try {
    const books = await getAllBooksByUserId(req.user._id);

    res.status(200).json({
      success: true,
      data: books,
      message: "Books retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving books:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
});

router.get("/:book", authRoute, async (req, res) => {
  try {
    const { book } = req.params;

    const bookDoc = await getBookById(book, req.user._id);

    res.status(200).json({
      success: true,
      data: bookDoc,
      message: "Book retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving book:", error);
    res.status(404).json({
      success: false,
      error: "Book not found",
      message: error.message,
    });
  }
});

router.get("/:book/:page", authRoute, async (req, res) => {
  try {
    const { book, page } = req.params;
    const pageNum = parseInt(page);

    const bookDoc = await getBookById(book, req.user._id);
    if (!bookDoc) {
      return res.status(404).json({ error: "Book not found" });
    }

    await updateCurrentPage(book, pageNum);

    const pdfBuffer = await getFile(bookDoc.file.path);
    const data = await pdf(pdfBuffer);

    if (pageNum < 1 || pageNum > data.numpages) {
      return res.status(400).json({ error: "Invalid page number" });
    }

    const pageContent = extractPageContent(data, pageNum);

    const translations = await translateContent(
      pageContent,
      bookDoc.originalLanguage,
      bookDoc.translatedLanguage,
    );

    const translated = translations.map(
      (translation) => translation.translated,
    );

    var mostCommonWordsWithTranslations = await getCommonWords(
      translated.join(""),
      bookDoc.originalLanguage,
      bookDoc.translatedLanguage,
      bookDoc.newWords,
      req.user._id,
    );

    const knownWords = await getKnownWords(
      translated.join(""),
      bookDoc.originalLanguage,
      bookDoc.translatedLanguage,
      req.user._id,
    );

    res.status(200).json({
      book: bookDoc.title,
      page: pageNum,
      knownWords: knownWords,
      totalPages: data.numpages,
      originalLanguage: bookDoc.originalLanguage,
      translatedLanguage: bookDoc.translatedLanguage,
      translations,
      mostCommonWords: mostCommonWordsWithTranslations,
    });
  } catch (error) {
    console.error("Error retrieving book page:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
