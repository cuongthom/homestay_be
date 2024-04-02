const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')
const isEmail = require('validator/lib/isEmail')

var userSchema = new mongoose.Schema(
    {
        id: { type: ObjectId },
        email: {
            type: String,

            validate: {
                validator: (value) => isEmail,
                message: 'email is incorrect format'
            },
        },
        password: {
            type: String,
            required: true
        },
        userName: {
            type: String,
            require: true,
            validate: {
                validator: (value) => value.length > 3,
                message: 'UserName must be at least 3 character'
            }
        },

        phoneNumber: {
            type: Number,
        },
        address: {
            type: String,
            required: true
        },
        price: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
        },

    }
)

module.exports = mongoose.model('User', userSchema)