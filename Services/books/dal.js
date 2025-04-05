const { models } = require("mongoose");
const { Book } = require("../../Schema");
const { getWords, getWordsTranslated } = require("../words/dal");
const { translateWord } = require("../translation/dal");

const findMostCommonWords = (pageContent, numWords, knownWordsSet) => {
  const words = pageContent
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .split(" ")
    .filter((word) => word.trim().length > 0)
    .filter((word) => !knownWordsSet.has(word.toLowerCase())); // Exclude known words

  const wordFrequency = {};
  words.forEach((word) => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });

  const sortedWords = Object.entries(wordFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, numWords)
    .map(([word, frequency]) => ({
      word,
      frequency,
    }));

  return sortedWords;
};

const createBook = async (bookData) => {
  try {
    const newBook = new Book(bookData);
    const savedBook = await newBook.save();
    return savedBook;
  } catch (error) {
    throw error;
  }
};

const getBookById = async (bookId, user_id) => {
  try {
    const book = await Book.findOne({ _id: bookId, user_id }).populate("file");
    if (!book) {
      throw new Error("Book not found");
    }
    return book;
  } catch (error) {
    throw error;
  }
};

const getAllBooksByUserId = async (user_id) => {
  try {
    const books = await Book.find({ user_id }).populate("file");
    return books;
  } catch (error) {
    throw error;
  }
};

const getCommonWords = async (text, lng, transLng, newWords, user_id) => {
  try {
    const words = [
      ...new Set(
        text
          .split(" ")
          .filter((word) => word.trim() !== "")
          .map((word) => word.toLowerCase()),
      ),
    ];

    const knownWords = await getWordsTranslated(words, lng, transLng, user_id);

    const knownWordsSet = new Set(
      knownWords.map((item) => item.translatedWord.toLowerCase()),
    );
    const mostCommonWords = findMostCommonWords(text, newWords, knownWordsSet);

    const commonWordsTranslations = await Promise.all(
      mostCommonWords.map(async ({ word }) =>
        translateWord(word, transLng, lng, user_id),
      ),
    );

    const mostCommonWordsWithTranslations = mostCommonWords.map(
      (item, index) => ({
        word: item.word,
        translation: commonWordsTranslations[index],
        originalLanguage: transLng,
        translatedLanguage: lng,
        frequency: item.frequency,
      }),
    );

    return mostCommonWordsWithTranslations;
  } catch (error) {
    throw error;
  }
};

const getKnownWords = async (text, lng, transLng, user_id) => {
  try {
    const words = [
      ...new Set(
        text
          .split(" ")
          .filter((word) => word.trim() !== "")
          .map((word) => word.toLowerCase()),
      ),
    ];
    const knownWords = await getWordsTranslated(
      words,
      lng,
      transLng,
      user_id,
      true,
    );

    return knownWords;
  } catch (error) {
    throw error;
  }
};

const updateCurrentPage = async (bookId, pageNum) => {
  try {
    const updatedBook = await Book.findOneAndUpdate(
      { _id: bookId },
      { pageNumber: pageNum },
      { new: true },
    );
    return updatedBook;
  } catch (error) {
    throw error;
  }
};

const getLanguages = async () => {
  try {
    // Get list of supported languages
    const [languages] = await translate.getLanguages();
    return languages;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createBook,
  getBookById,
  getAllBooksByUserId,
  getCommonWords,
  getKnownWords,
  updateCurrentPage,
  getLanguages,
};
