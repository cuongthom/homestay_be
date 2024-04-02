const { ObjectId } = require("mongodb");
const Homestay = require("../models/Homestay")

const uploadImageRoom = async ({ userName, property }) => {
    try {
        const existingUser = await Homestay.findOne({ userName })
        if (existingUser) {

            existingUser.property.push(property);
            await existingUser.save();
            return {
                ...existingUser._doc,
            };
        } else {
            const newRoom = await Homestay.create({ userName, property });
            return {
                ...newRoom._doc,
            };
        }

    } catch (err) {
        throw new Error(err)
    }
}

const searchRoombyAddress = async ({ page, sizeMax, search }) => {
    let fillterRoom = await Homestay.aggregate([
        {
            $match: {
                $or: [
                    {
                        userName: { $regex: `.*${search}.*`, $options: 'i' }
                    },
                    {
                        "property.address": { $regex: `.*${search}.*`, $options: 'i' }
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
    return fillterRoom
}

const getroomById = async (idRoom) => {
    try {
        const room = await Homestay.findOne({
            'property._id': idRoom,
        });

        if (!room) {
            throw new Error('can not find room with id ' + idRoom)
        }
        return room
    } catch (err) {
        throw new Error(err)
    }
}

const updateRoom = async (idRoom, params) => {

    try {
        const updatedRoom = await Homestay.findOneAndUpdate(
            { 'property._id': idRoom }, // Điều kiện để tìm property
            {
                $set: {
                    'property.$.address': params.address ?? '$property.$.address',
                    'property.$.description': params.description ?? '$property.$.description',
                    'property.$.isOut': params.isOut !== undefined ? params.isOut : '$property.$.isOut',
                    'property.$.note': params.note ?? '$property.$.note',
                    'property.$.price': params.price ?? '$property.$.price',
                    'property.$.sale': params.sale !== undefined ? params.sale : '$property.$.sale',
                    'property.$.title': params.title ?? '$property.$.title'
                }
            }, // Cập nhật property tìm thấy với params mới
            { new: true } // Trả về property sau khi cập nhật
        );
        if (!updatedRoom) {
            throw new Error('Không tìm thấy phòng');
        }
        return updatedRoom
    } catch (err) {
        throw new Error(err)
    }
}

const deleteRoom = async (idRoom) => {

    try {
        const homestay = await Homestay.findOne({ 'property._id': idRoom });

        if (!homestay) {
            throw new Error('Không tìm thấy homestay');
        }

        homestay.property.pull({ _id: idRoom }); // Xóa phần tử trong mảng property có _id là idRoom

        await homestay.save(); // Lưu lại homestay sau khi xóa

        return homestay;
    } catch (err) {
        throw new Error(err)
    }
}

module.exports = { uploadImageRoom, searchRoombyAddress, getroomById, updateRoom, deleteRoom }