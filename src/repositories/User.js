const User = require("../models/User");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { faker } = require('@faker-js/faker')
const login = async ({ email, password }) => {
    const existingUser = await User.findOne({ email }).exec()
    if (existingUser) {
        let isMatch = await bcrypt.compare(password, existingUser.password)
        if (!!isMatch) {
            const JWTToken = jwt.sign({ data: existingUser }, process.env.JWT_SECRET, { expiresIn: "10 days" })
            return {
                ...existingUser.toObject(),
                JWT: JWTToken,
            }
        } else {
            throw new Error('wrong email or password ')
        }
    } else {
        throw new Error("wrong email or password ")
    }
}
const register = async ({ email, password, userName, address }) => {
    try {
        const existingUser = await User.findOne({ email }).exec()
        if (!!existingUser) {
            throw new Error('user already exists')
        }
        // const isMatched = await bcrypt.compare(password, existingUser.password)
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.HASHED_PASSWORD))
        const newUser = await User.create({ email, password: hashedPassword, userName, address, price: 0, role: "USER" })
        return {
            ...newUser._doc,
        }
    } catch (err) {
        throw new Error(err)
    }
}

const generateFakerUser = async () => {
    const pushUser = []
    try {
        for (let i = 0; i < 10; i++) {
            let createUser = {
                email: faker.internet.email(),
                address: faker.location.streetAddress(),
                userName: faker.internet.userName(),
                password: faker.internet.password()

            }
            pushUser.push(createUser)
        }
        const res = await User.insertMany(pushUser)
    } catch (err) {
        throw new Error(err)
    }
}

const getAllUser = async ({ page, sizeMax, search }) => {
    let fillterUser = await User.aggregate([
        {
            $match: {
                $or: [
                    {
                        userName: { $regex: `.*${search}.*`, $options: 'i' }
                    },
                    {
                        email: { $regex: `.*${search}.*`, $options: 'i' }
                    },
                    {
                        address: { $regex: `.*${search}.*`, $options: 'i' }
                    },
                ]
            }
        },
        {
            $skip: (page - 1) * Number(sizeMax)
        },
        {
            $limit: Number(sizeMax),
        }
    ])
    return fillterUser
}

const getUserById = async (userId) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new Error('can not find student with id ' + userId)
        }
        return user
    } catch (err) {
        throw new Error(err)
    }
}

const updateUser = async ({ id, userName, email, address }) => {

    try {
        const user = await User.findById(id)
        user.userName = userName ?? user.userName
        user.email = email ?? user.email
        user.address = address ?? user.address
        await user.save()
        return user
    } catch (err) {
        throw new Error(err)
    }
}
const getUserByJWT = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const idUser = decoded?.data?._id || ""
        const user = await User.findOne({ _id: idUser }).exec()
        // If user not found, throw error
        if (!user) {
            throw new Error()
        }
        return user
    } catch (err) {
        throw new Error(err)
    }
}

const changePassword = async ({ userid, currentPassword, newPassword, confirmNewPassword }) => {
    try {
        const existingUser = await User.findOne({ _id: userid }).exec()
        const isMatch = await bcrypt.compare(currentPassword, existingUser.password);
        if (!isMatch) return
        const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.HASHED_PASSWORD))
        const newPasswordVerify = await User.updateOne({ _id: userid }, { $set: { password: hashedPassword } })
        return newPasswordVerify
    } catch (err) {
        throw new Error(err)
    }
}

module.exports = { getUserByJWT, login, register, generateFakerUser, getAllUser, getUserById, updateUser, changePassword }