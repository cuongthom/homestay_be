const { login, register, generateFakerUser, getAllUser, getUserById, updateUser, getUserByJWT, changePassword } = require('../repositories/User')
const { validationResult } = require('express-validator')
const { HttpStatusCode } = require('../exceptions/HttpStatusCode')
const jwt = require('jsonwebtoken');
// lang nghe su kien
const { EventEmitter } = require('node:events');
const User = require('../models/User');
const myEvent = new EventEmitter()
myEvent.on('even.login.user', (params) => {
    console.log(`they talk abount : ${JSON.stringify(params)}`);
})
myEvent.on('even.register.user', (params) => {
    console.log(`they talk abount : ${JSON.stringify(params)}`);
})

const loginUser = async (req, res) => {
    const { email, password } = req.body
    // check xem dữ liệu đầu vào có gì sai không
    // khi sai hasErrors sẽ trả về true và hàm không chạy nữa
    const errors = validationResult(req)
    const hasErrors = !errors.isEmpty();
    if (hasErrors) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ errors: errors.array() })
    }
    // lang nghe su kien
    myEvent.emit('even.login.user', { email, password })
    try {
        const existingUser = await login({ email, password })
        res.status(HttpStatusCode.OK).json({
            message: 'login user successfully',
            data: existingUser
        })
    } catch (err) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
            message: err.message
        })
    }
}

const registerUser = async (req, res) => {
    const { email, password, userName, address } = req.body
    myEvent.emit('even.register.user', { email, password })
    try {
        const user = await register({ email, password, userName, address })
        res.status(HttpStatusCode.INSERT_OK).json({
            message: 'register success',
            data: user
        })
    } catch (err) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            message: err.message
        })
    }


}
const getDetailUser = async (req, res) => {
    const JWT = req.headers?.authorization?.split(" ")[1]
    try {
        const jwtObject = jwt.verify(JWT, process.env.JWT_SECRET)
        res.status(HttpStatusCode.INSERT_OK).json({
            message: "detail success",
            data: jwtObject
        })
    } catch (err) {
        res.status(HttpStatusCode.NOT_FOUND).json({
            message: err.message
        })
    }
}

const generateUser = async (req, res) => {
    try {
        const resporn = await generateFakerUser(req.body)
        res.status(HttpStatusCode.INSERT_OK).json({
            message: 'fake success',
            data: resporn
        })
    } catch (err) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
            message: err.message
        })
    }
}

const getAllUserController = async (req, res) => {
    try {
        let { page = 1, size = process.env.MAX_RECORDS, search = "" } = req.query
        let sizeMax = size >= process.env.MAX_RECORDS ? process.env.MAX_RECORDS : size
        const filterUser = await getAllUser({ sizeMax, page, search })
        res.status(HttpStatusCode.INSERT_OK).json({
            message: "get all user success",
            size: filterUser.length,
            data: filterUser
        })
    } catch (err) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
            message: err.message
        })
    }
}

const getUserId = async (req, res) => {
    const id = req.params.id
    try {
        const user = await getUserById(id)
        res.status(HttpStatusCode.INSERT_OK).json({
            message: "get user by id success",
            data: user
        })
    } catch (err) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
            message: err.message,
        })
    }
}

const updateUserId = async (req, res) => {
    const { id, email, userName, address } = req.body
    try {
        const user = await updateUser({ id, email, userName, address })
        res.status(HttpStatusCode.INSERT_OK).json({
            message: "update user success",
            data: user
        })
    } catch (err) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
            message: err.message,
        })
    }
}

const getUserByToken = async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const resp = await getUserByJWT(token)
        res.status(HttpStatusCode.INSERT_OK).json({
            message: "get user success",
            data: resp
        })
    } catch (err) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
            message: err.message,
        })
    }
}

const changePasswordUser = async (req, res) => {
    const { userid, currentPassword, newPassword, confirmNewPassword } = req.body;
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        console.log("Please fill in all fields");
        return
    }

    //Check passwords match
    if (newPassword !== confirmNewPassword) {
        console.log("New passwords do not match");
        return
    }

    //Check password length
    if (newPassword.length < 6 || confirmNewPassword.length < 6) {
        console.log("Password should be at least six characters");
        return
    }
    try {

        const resp = await changePassword({ userid, currentPassword, newPassword, confirmNewPassword })
        res.status(HttpStatusCode.INSERT_OK).json({
            message: "change password success",
            data: resp
        })
    } catch (err) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
            message: err.message,
        })
    }
}

const getAllUserNew = async (req, res) => {
    try {
        const getAll = await User.find()
        res.status(HttpStatusCode.INSERT_OK).json({
            message: "get all user success",
            data: getAll
        })
    } catch (err) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
            message: err.message,
        })
    }
}

module.exports = { loginUser, registerUser, getDetailUser, generateUser, getAllUserController, getUserId, updateUserId, getUserByToken, changePasswordUser, getAllUserNew }