const express = require("express");
const {
  uploadFileToBuffer,
  getBufferById,
} = require("../controllers/UploadController");
const router = express.Router();

router.post("/uploadfile", uploadFileToBuffer);
router.get("/:id", getBufferById);
module.exports = router;
