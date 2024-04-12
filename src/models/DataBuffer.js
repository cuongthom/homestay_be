const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

var DataBuffer = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lightHouseUploadedId: {
    type: String,
    required: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

module.exports = mongoose.model("uploadFile", DataBuffer);
