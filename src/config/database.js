const mongoose = require('mongoose');

const connectDB = async () => {
    return await mongoose.connect('mongodb+srv://rishabhtyagi:9811594876%40Rt@devtinder.oultbau.mongodb.net/devTinder');
}

module.exports = connectDB;

