
const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')
const isEmail = require('validator/lib/isEmail')

var HomestaySchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            require: true,
            validate: {
                validator: (value) => value.length > 3,
                message: 'ownerName must be at least 3 character'
            }
        },
        property: [{
            images: [String], // Array of image URLs for the property
            title: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
            amenitiesOut: [String], // Array of amenities
            price: {
                type: Number,
                required: true,
            },
            address: {
                type: String,
                required: true,
            },
            note: {
                type: String,
                required: true,
            },
            createAt: {
                type: String,
                required: true,
            },
            isOut: [String],
            sale: [String],
            comment: [String]
        }],

    }
)

module.exports = mongoose.model('Homestay', HomestaySchema)