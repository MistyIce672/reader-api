const { Word } = require("../../Schema");

const getWords = async (
  wordList,
  language,
  translatedLanguage,
  user_id,
  translate = null,
) => {
  try {
    const query = {
      originalWord: { $in: wordList },
      originalLanguage: language,
      translatedLanguage: translatedLanguage,
      user_id: user_id,
    };

    // Only add translate field if it's not null
    if (translate !== null) {
      query.translate = translate;
    }

    const matchingWords = await Word.find(query);
    return matchingWords;
  } catch (error) {
    throw error;
  }
};

const getWordsTranslated = async (
  wordList,
  language,
  translatedLanguage,
  user_id,
  translate = null,
) => {
  try {
    const query = {
      translatedWord: { $in: wordList },
      originalLanguage: language,
      translatedLanguage: translatedLanguage,
      user_id: user_id,
    };

    // Only add translate field if it's not null
    if (translate !== null) {
      query.translate = translate;
    }

    const matchingWords = await Word.find(query);
    return matchingWords;
  } catch (error) {
    throw error;
  }
};

const getAllKnownWords = async (
  originalLanguage,
  translatedLanguage,
  user_id,
) => {
  try {
    const words = await Word.find({
      originalLanguage: originalLanguage,
      translatedLanguage: translatedLanguage,
      user_id: user_id,
    });
    return words;
  } catch (error) {
    throw error;
  }
};

// Add addKnownWords function
const addKnownWords = async (
  originalWord,
  translatedWord,
  originalLanguage,
  translatedLanguage,
  translate,
  user_id,
) => {
  try {
    // Create a new word document
    const newWord = new Word({
      user_id,
      originalLanguage,
      translatedLanguage,
      originalWord,
      translatedWord,
      translate, // Assuming all words added this way should be translated
    });

    // Save the word to the database
    const result = await newWord.save();
    return result;
  } catch (error) {
    throw error;
  }
};

const deleteWord = async (wordId, user_id) => {
  try {
    const result = await Word.findOneAndDelete({
      _id: wordId,
      user_id: user_id,
    });
    return result;
  } catch (error) {
    throw error;
  }
};

const updateWordTranslate = async (wordId, user_id, translate) => {
  try {
    const result = await Word.findOneAndUpdate(
      {
        _id: wordId,
        user_id: user_id,
      },
      { translate: translate },
      { new: true }, // Returns the updated document
    );
    return result;
  } catch (error) {
    throw error;
  }
};

// Don't forget to add these to the exports
module.exports = {
  getWords,
  getAllKnownWords,
  addKnownWords,
  getWordsTranslated,
  deleteWord, // Add this
  updateWordTranslate, // Add this
};
