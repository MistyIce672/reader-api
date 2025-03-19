const multer = require("multer");
const express = require("express");
const router = express.Router();
const { uploadFile, createFile, getFile } = require("./dal");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const fileDoc = await createFile({
      name: req.file.originalname,
      size: req.file.size,
      type: req.body.type,
    });
    uploadFile(fileDoc.path, req.file.buffer);
    res.status(201).json({ _id: fileDoc._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to upload file",
    });
  }
});

router.get("/:filename", async (req, res) => {
  try {
    const filename = req.params.filename;
    const data = await getFile(filename);
    res.send(data);
  } catch (error) {
    if (error.name == "NoSuchKey") {
      res.status(500).json({ error: "invalid file name" });
    } else {
      console.log(error);
      res.status(500).json({ error: "error while getting file" });
    }
  }
});

module.exports = router;
