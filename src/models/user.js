const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address: " + value);
            }
        },
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter a Strong Password: " + value);
            }
        },
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        enum: {
            values: ['male', 'female', 'other'],
            message: `{value} is not a valid gender type`
        }
    },
    isPremium: {
        type: Boolean,
        default: false,
    },
    photoUrl: {
        type: String,
        default: "https://geographyandyou.com/images/user-profile.png",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid Photo URL: " + value);
            }
        },
    },
    about: {
        type: String,
        default: "This is a default about of the user!",
    },
    skills: {
        type: [String],
    },
}, {
    timestamps: true
})

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "DevTinder", {
        expiresIn: '7d'
    });
    return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const isPasswordValid = bcrypt.compare(passwordInputByUser, user.password);
    return isPasswordValid;
}

const userModel = mongoose.model('User', userSchema)
module.exports = userModel;