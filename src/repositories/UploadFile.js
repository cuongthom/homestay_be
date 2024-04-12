const DataBuffer = require("../models/DataBuffer");
const UploadFileModel = require("../models/UploadFileModel");
const { Binary } = require("mongodb");
const informationFile = async ({ name, type }) => {
  try {
    const newFile = await UploadFileModel.create({
      name,
      type,
    });
    console.log("newFile", newFile);
    return {
      ...newFile._doc,
    };
  } catch (err) {
    throw new Error(err);
  }
};
const getIdFileBuffer = async (id) => {
  try {
    const fileBuffer = await DataBuffer.findOne({
      lightHouseUploadedId: id,
    });
    const binaryData = new Binary(Buffer.from(fileBuffer.data, "base64"));
    console.log("fileBuffer", binaryData);
    return fileBuffer;
  } catch (err) {
    throw new Error(err);
  }
};

const getArrayFileBuffer = async (file) => {
  try {
    // const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(file.data);
    return fileBuffer;
    console.log("fileBuffer", fileBuffer);
  } catch (err) {
    throw new Error(err);
  }
};
module.exports = { informationFile, getIdFileBuffer, getArrayFileBuffer };
