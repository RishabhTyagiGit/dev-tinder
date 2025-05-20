const express = require('express');
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');
const connectDB = require('./config/database')
const { validateSignUpData } = require("./utils/validation")

const app = express();
const User = require("./models/user");
const { userAuth } = require('./middlewares/auth');

app.use(express.json())
app.use(cookieParser());

app.post('/signup', async (req, res) => {
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

app.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid Credentials");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid Credentials");
        } else {
            const token = await jwt.sign({ _id: user._id }, "DevTinder");
            res.cookie('token', token, {
                expires: new Date(Date.now() + 8 * 3600000),
            });
            res.send("login Successfully!")
        }
    } catch (err) {
        res.status(400).send("Error: " + err.message)
    }
})

app.get('/profile', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

app.get('/users', async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        const users = await User.find({ emailId: userEmail });
        if (users.length === 0) {
            res.status(404).send('User Not Found');
        } else {
            res.send(users);
        }
    } catch (err) {
        res.status(400).send('Something Went Wrong!');
    }
})

app.get('/user', async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        const users = await User.findOne({ emailId: userEmail });
        if (users.length === 0) {
            res.status(404).send('User Not Found');
        } else {
            res.send(users);
        }
    } catch (err) {
        res.status(400).send('Something Went Wrong!');
    }
})

app.delete('/user', async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete({ _id: userId });
        res.send('User Deleted Sucessfully')
    } catch (err) {
        res.status(400).send('Something Went Wrong!');
    }
})

app.patch('/user', async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;

    try {
        const ALLOWED_UPDATES = [
            'photoUrl',
            'about',
            'gender',
            'age',
            'skills',
            'userId'
        ]

        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));

        if (!isUpdateAllowed) {
            throw new Error("Update not allowed!")
        }
        await User.findByIdAndUpdate({ _id: userId }, data, {
            runValidators: true
        });
        res.send('User Updated Successfully!')
    } catch (err) {
        res.status(400).send('Update Failed: ' + err.message)
    }
})


app.get('/feed', async (req, res) => {
    try {
        const users = await User.find({});
        if (users.length === 0) {
            res.status(404).send('Users Not Found');
        } else {
            res.send(users);
        }
    } catch (err) {
        res.status(400).send('Something Went Wrong!');
    }
})

connectDB().then(() => {
    console.log('Database connection established...');
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    })
})
    .catch((err) => {
        console.error("Database cannot be connected!!")
    })