const { Translate } = require("@google-cloud/translate").v2;
const { calculatePointsCost, deductPoints } = require("../points/dal");

const translate = new Translate({
  projectId: "translater-453918",
  keyFilename: "token.json",
});

const translateWord = async (
  word,
  originalLanguage,
  translatedLanguage,
  userId,
) => {
  const pointsCost = calculatePointsCost(word);
  await deductPoints(userId, pointsCost);
  console.log(word, pointsCost);

  const [translation] = await translate.translate(word, {
    from: originalLanguage,
    to: translatedLanguage,
  });
  return translation;
};

const translateContent = async (
  content,
  originalLanguage,
  translatedLanguage,
  userId,
) => {
  const pointsCost = calculatePointsCost(content);
  await deductPoints(userId, pointsCost);
  console.log(content, pointsCost);

  const sentences = content.split(".").filter((sentence) => sentence.trim());

  const translations = await Promise.all(
    sentences.map(async (sentence) => {
      if (!sentence.trim()) return null;

      const [translation] = await translate.translate(sentence.trim(), {
        from: originalLanguage,
        to: translatedLanguage,
      });

      return {
        original: sentence.trim(),
        translated: translation,
      };
    }),
  );

  return translations.filter((t) => t !== null);
};

module.exports = {
  translateWord,
  translateContent,
};
