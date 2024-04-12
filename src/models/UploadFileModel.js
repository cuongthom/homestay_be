const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

var UploadFileSchema = new mongoose.Schema({
  id: { type: ObjectId },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("uploadFileBuffer", UploadFileSchema);
