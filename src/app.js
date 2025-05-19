const express = require('express');
const validator = require('validator');
const connectDB = require('./config/database')

const app = express();
const User = require("./models/user");

app.use(express.json())

app.post('/signup', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save();
        res.send('user added successfully!!')
    } catch (err) {
        res.status(500).send("Error saving the user:", err.message)
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
        res.status(400).send('Update Failed: '+ err.message)
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