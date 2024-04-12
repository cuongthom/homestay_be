const { HttpStatusCode } = require("../exceptions/HttpStatusCode");
const DataBuffer = require("../models/DataBuffer");
const {
  informationFile,
  getIdFileBuffer,
  getArrayFileBuffer,
} = require("../repositories/UploadFile");
const { EventEmitter } = require("node:events");
const myEvent = new EventEmitter();
myEvent.on("even.data.file", async (params) => {
  // console.log("params", params);

  console.log("newFile", newFile);
  // console.log(`they talk : ${JSON.stringify(params.name)}`);
});

const uploadFileToBuffer = async (req, res, next) => {
  try {
    const getArrayBuffer = await getArrayFileBuffer(req.files.undefined);
    console.log("getArrayBuffer", getArrayBuffer);
    // var fileBuffer = Buffer.from(req.files.undefined.data, "base64");
    // console.log("fileBuffer", fileBuffer);
    const resp = await informationFile({
      name: req?.files?.undefined?.name,
      type: "Buffer",
    });
    // console.log("resp", resp);
    const newFile = await DataBuffer.create({
      name: req?.files?.undefined?.name,
      lightHouseUploadedId: resp?._id,
      data: getArrayBuffer,
    });

    res.status(HttpStatusCode.INSERT_OK).json({
      message: "upload file success",
      data: newFile,
    });
  } catch (err) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      message: err.message,
    });
  }
};

const getBufferById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const resp = await getIdFileBuffer(id);
    res.status(HttpStatusCode.INSERT_OK).json({
      message: "success",
      data: resp,
    });
  } catch (err) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      message: err.message,
    });
  }
};

module.exports = { uploadFileToBuffer, getBufferById };
