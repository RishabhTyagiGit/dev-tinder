const express = require("express");
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require("../models/user");
const {validateSignUpData} = require('../utils/validation')

authRouter.post('/signup', async (req, res) => {
    try {
        validateSignUpData(req);
        const { firstName, lastName, emailId, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        })
        await user.save();
        res.send('user added successfully!!')
    } catch (err) {
        console.log(err)
        res.status(500).send("Error saving the user:", err.message)
    }
})

authRouter.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid Credentials");
        }
        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            throw new Error("Invalid Credentials");
        } else {
            const token = await user.getJWT();
            res.cookie('token', token, {
                expires: new Date(Date.now() + 8 * 3600000),
            });
            res.send("login Successfully!")
        }
    } catch (err) {
        res.status(400).send("Error: " + err.message)
    }
})

module.exports = authRouter;