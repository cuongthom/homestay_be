const { HttpStatusCode } = require("../exceptions/HttpStatusCode");
const Homestay = require("../models/Homestay");
const {
  uploadImageRoom,
  searchRoombyAddress,
  getroomById,
  updateRoom,
  deleteRoom,
} = require("../repositories/HomeStayImage");

const uploadImage = async (req, res, next) => {
  const { userName, property } = req.body;
  try {
    const resp = await uploadImageRoom({ userName, property });
    res.status(HttpStatusCode.INSERT_OK).json({
      message: "Add room success!",
      data: resp,
    });
  } catch (err) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      message: err.message,
    });
  }
};

const getAllRoom = async (req, res, next) => {
  try {
    const resp = await Homestay.find();
    res.status(HttpStatusCode.INSERT_OK).json({
      message: "Add room success!",
      data: resp,
    });
  } catch (err) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      message: err.message,
    });
  }
};

const searchRoom = async (req, res) => {
  try {
    let { page = 1, size = 50, search } = req.query;
    console.log("search", search);
    let sizeMax =
      size >= process.env.MAX_RECORDS ? process.env.MAX_RECORDS : size;
    const filterUser = await searchRoombyAddress({ sizeMax, page, search });
    console.log("filterUser", filterUser);
    res.status(HttpStatusCode.INSERT_OK).json({
      message: "get all room success",
      size: filterUser.length,
      data: filterUser,
    });
  } catch (err) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      message: err.message,
    });
  }
};

const uploadFileImage = async (req, res, next) => {
  if (!req.files) return;
  try {
    res.status(HttpStatusCode.INSERT_OK).json({
      message: "success",
      data: req.files,
    });
  } catch (err) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      message: err.message,
    });
  }
};

const getRoomById = async (req, res) => {
  const { id } = req.query;
  try {
    const room = await getroomById(id);
    res.status(HttpStatusCode.INSERT_OK).json({
      message: "get room by id success",
      data: room,
    });
  } catch (err) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      message: err.message,
    });
  }
};

const updateRoomById = async (req, res) => {
  const { id } = req.query;
  const params = req.body;
  try {
    const user = await updateRoom(id, params);
    res.status(HttpStatusCode.INSERT_OK).json({
      message: "update room success",
      data: user,
    });
  } catch (err) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      message: err.message,
    });
  }
};

const deleteRoomById = async (req, res) => {
  const { id } = req.query;
  try {
    const room = await deleteRoom(id);
    res.status(HttpStatusCode.INSERT_OK).json({
      message: "delete room success",
      data: room,
    });
  } catch (err) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      message: err.message,
    });
  }
};

module.exports = {
  uploadFileImage,
  uploadImage,
  searchRoom,
  getAllRoom,
  getRoomById,
  updateRoomById,
  deleteRoomById,
};
