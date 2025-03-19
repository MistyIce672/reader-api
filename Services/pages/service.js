const express = require("express");
const router = express.Router();
const { Translate } = require("@google-cloud/translate").v2;

const translate = new Translate({
  projectId: "translater-453918",
  keyFilename: "token.json",
});

const text = `J’ai encore fui.
Comme si ça arrangeait la situation.
Fuir, c’est seulement retarder l’inéluctable. Prendre le risque que le
problème revienne en boomerang pour frapper dix fois plus fort.
J’aurais mieux fait de rester enfermée dans ma chambre, à fixer ma peau
virer au violet au fil de la nuit. À force, je connais toutes les nuances de
couleurs qui suivent le premier coup et leur ordre d’apparition. C’est
toujours le même rituel : une fois sa crise passée, s’assurer que personne n’a
entendu les claquements secs et répétitifs, ranger l’objet, me détruire du
regard parce que je suis encore la cause de sa colère et quitter la pièce. Je
peux alors appliquer de la glace pour soulager la douleur, avec l’espoir que
ce soit la dernière fois. Mais c’est comme demander à la Terre d’arrêter de
graviter autour du Soleil.
Impossible et inconcevable.
Demain matin, j’enfilerai un sweat-shirt à manches longues même si les
journées de juin sont de plus en plus chaudes et je descendrai dans la
cuisine. Je les saluerai en prétendant que ces énormes bleus sur mon corps
n’existent pas.
Ce ne sera qu’un jour de plus à faire comme si tout allait bien.
Les mains enfoncées dans les manches de mon pyjama, je traîne mes
Converse vertes sur le gravier poudreux du square. Il n’est qu’à un pâté de
maisons. Je ne devrais pas m’y aventurer à cette heure-ci, au risque de
croiser des camés qui se piquent sur les balançoires, entourés de packs de
bières bon marché. Mais je n’entends rien en m’approchant des buissons.
Le petit portail est resté entrouvert et ne cesse de claquer à cause du vent. Il
y a toujours un lampadaire pour éclairer l’aire de jeu de fortune, deux
balançoires et un tourniquet rouillé. Malgré son grincement strident, les
enfants l’adorent.`;

router.get("/", async (req, res) => {
  try {
    const sentences = text.split(".").filter((sentence) => sentence.trim());

    // Translate each sentence
    const translations = await Promise.all(
      sentences.map(async (sentence) => {
        if (!sentence.trim()) return null;

        const [translation] = await translate.translate(sentence.trim(), {
          from: "fr",
          to: "en",
        });

        return {
          original: sentence.trim(),
          translated: translation,
        };
      }),
    );

    // Filter out null values and return results
    const validTranslations = translations.filter((t) => t !== null);

    res.status(200).json({
      data: validTranslations,
    });
  } catch (error) {
    console.error("Error creating account:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
