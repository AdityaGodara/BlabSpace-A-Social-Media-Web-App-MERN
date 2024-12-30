const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require("dotenv").config();

const secretKey = process.env.secretKey;

const { User } = require("../models/userModel")
const { Gang } = require('../models/gangModel')


//REGISTER NEW USER
router.post('/register', async (req, res) => {
    const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
        gender: req.body.gender,
        avatar: req.body.avatar
    }
    const existingUser = await User.findOne({ username: data.username })

    if (existingUser) {
        res.status(200).json({ message: "User Already Exist" })
    } else {
        const saltRounds = 10
        const hashedPass = await bcrypt.hash(data.password, saltRounds)

        data.password = hashedPass

        const userdata = await User.insertMany(data)
        console.log(userdata)
        res.status(200).json({ message: "User registered successfully!" })
    }
})


//DELETE EXISTING USER
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // If user belongs to a gang, remove them from the gang's members
        if (user.gang_id) {
            await Gang.findByIdAndUpdate(user.gang_id, {
                $pull: { members: id }
            });
        }

        // Delete the user
        await User.findByIdAndDelete(id);

        res.status(200).json({ message: "Profile has been deleted!" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "An error occurred while deleting the user", error: error.message });
    }
});

//LOGIN EXISTING USER
router.post('/login', async (req, res) => {
    try {
        const check = await User.findOne({ username: req.body.username })
        if (!check) {
            return res.status(404).json({ message: "User not registered" })
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, check.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" })
        }

        const jwtToken = jwt.sign(
            {
                id: check._id,
                email: check.email,
                username: check.username,
                password: check.password,
                name: check.name,
                gender: check.gender,
                avatar: check.avatar,
                isLeader: check.isLeader,
                gang_id: check.gang_id
            },
            secretKey,
            { expiresIn: '5h' }
        )

        res.status(200).json({ message: `Welcome back, ${check.name}`, token: jwtToken, secretKey })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "An error occurred during login" })
    }
})

//Function to verify token from localStorage
const verifyToken = async (req, res) => {

    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, secretKey, (err,res)=>{
            if(err){
                return "token expired"
            }
            return res
        });
        res.json({ decoded });
    } catch (error) {
        console.error("Error verifying token:", error);
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        }
        res.status(500).json({ message: "Server error" });
    }
};

//PROFILE INFO
router.get('/profile', verifyToken);

//GET USER INFO BY ID
router.get('/info/:u_id', async (req, res) => {
    const { u_id } = req.params
    try {
        const singleUser = await User.findById(u_id).select('name -_id')
        
        if (!singleUser) {
            return res.status(404).json({ message: 'User not found' })
        }

        return res.json({ 
            data: { name: singleUser.name }
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
})

module.exports = router