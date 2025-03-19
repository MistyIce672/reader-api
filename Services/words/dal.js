const { Word } = require("../../Schema");

const getWords = async (wordList, language, user_id) => {
  try {
    const matchingWords = await Word.find({
      word: { $in: wordList },
      language: language,
      user_id: user_id,
    });
    return matchingWords;
  } catch (error) {
    throw error;
  }
};
const getAllKnownWords = async (language, user_id) => {
  try {
    const words = await Word.find({
      language: language,
      user_id: user_id,
    });
    return words;
  } catch (error) {
    throw error;
  }
};

// Add addKnownWords function
const addKnownWords = async (wordList, language, user_id) => {
  try {
    const wordsToInsert = wordList.map((word) => ({
      word,
      language,
      user_id,
    }));

    const result = await Word.insertMany(wordsToInsert);
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getWords,
  getAllKnownWords,
  addKnownWords,
};
