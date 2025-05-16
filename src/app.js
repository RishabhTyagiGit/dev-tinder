const express = require('express');
const connectDB = require('./config/database')

const app = express();
const User = require("./models/user");

app.post('/signup', async(req, res) => {
    const user = new User({
        firstName: "Rishabh",
        lastName: "Tyagi",
        emailId: "rishabhtyagi21.rt@gmail.com",
        password: '987788'
    })
    try {
        await user.save();
        res.send('user added successfully!!')
    } catch(err){
        res.status(500).send("Error saving the user:", err.message)
    }
})

connectDB().then(()=>{
    console.log('Database connection established...');
    app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})
})
.catch((err)=>{
    console.error("Database cannot be connected!!")
})