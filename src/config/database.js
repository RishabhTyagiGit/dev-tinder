const mongoose = require('mongoose');

const connectDB = async () => {
    return await mongoose.connect(process.env.DATABASE_CONNECTION_STRING);
}

module.exports = connectDB;

