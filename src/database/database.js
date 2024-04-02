const mongoose = require('mongoose')
const connect = async () => {
    try {
        let connection = await mongoose.connect(process.env.MONGGO_URI)
        if (connection) {
            console.log("connect success");
        }
        return connection
    } catch (err) {
        console.log(Object.keys(err));
        throw new Error(err.message)
    }
}

module.exports = { connect }