const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const { uploadFileImage, uploadImage, searchRoom, getRoomById, getAllRoom, updateRoomById, deleteRoomById, } = require('../controllers/ImageHomestay')

// router.get('/:id', getUserName)

router.post('/uploadfile', uploadFileImage)

router.post('/uploadimageroom', uploadImage)

router.get('/upload', uploadImage)

router.get('/search', searchRoom)

router.get('/getallroom', getAllRoom)

router.get('/getroombyid', getRoomById)

router.post('/updateroombyid', updateRoomById)

router.delete('/deleteroom', deleteRoomById)
// router.post('/delete', updateRoomById)

module.exports = router