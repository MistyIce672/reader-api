const { File } = require("../../Schema");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");

require("dotenv").config();

const client = new S3Client({
  forcePathStyle: false,
  endpoint: process.env.spaces_endpoint,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.spaces_access_key,
    secretAccessKey: process.env.spaces_sec_key,
  },
});

async function getFile(key) {
  try {
    const params = {
      Bucket: process.env.spaces_bucket,
      Key: key,
    };
    const buffer = Buffer.concat(
      await (await client.send(new GetObjectCommand(params))).Body.toArray(),
    );
    return buffer;
  } catch (error) {
    throw error;
  }
}

async function getFileById(id) {
  try {
    const fileDoc = await File.findOne({ _id: id });
    return fileDoc;
  } catch (error) {
    throw error;
  }
}

async function uploadFile(path, buffer) {
  try {
    const params = {
      Bucket: process.env.spaces_bucket,
      Key: path,
      Body: buffer,
    };
    const upload = new Upload({
      client,
      params,
    });
    const data = await upload.done();
    if (!data.Key) {
      throw new Error("Failed to upload file to bucket");
    }
  } catch (error) {
    throw error;
  }
}

async function createFile(fileData) {
  try {
    fileData.uploaded_on = new Date();
    const newFile = new File(fileData);
    newFile.path = `${newFile._id.toString()}.${fileData.name.split(".").slice(-1)}`;
    newFile.save();
    return newFile;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  uploadFile,
  client,
  createFile,
  getFile,
  getFileById,
};
