require('dotenv').config
const express = require("express")
const mongoose = require("mongoose")
const User = require('./models').user
const Task = require('./models').task
const { GenerateAccessToken, GenerateRefreshToken, auth } = require('../middlewares/auth')
const router = express.Router()

// TODO: Access and Refresh Token - JWT
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.uid)
        const data = await Task.find({ user: user._id }, '_id user title description deadline').sort({ deadline: '1' })
        return res.status(200).json({ msg: 'success', data: data })
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(500);
    }

})


router.post('/', auth, async (req, res) => {
    try {
        const date = new Date(req.body.date)
        const user = await User.findById(req.uid)
        const task = new Task({
            user: user._id,
            title: req.body.title,
            description: req.body.description,
            date: Date(),
            deadline: date
        })
        await task.save()
        res.status(201).json({ msg: 'success', id: task._id })
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
})


router.delete('/', auth, async (req, res) => {
    try {
        const id = req.body.todo
        await Task.deleteOne({ _id: id })
        return res.status(200).json({ msg: "success" })
    } catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }

})

router.put('/login', async (req, res) => {
    try {
        const uname = req.body.username;
        const passwd = req.body.password;

        const user = await User.findOne({ username: uname })
        if (user === null) return res.status(200).json({ msg: "User not found" })

        if (user.password !== passwd) return res.status(200).json({ msg: "Password is incorrect" })

        const token = JSON.stringify({ 'access': GenerateAccessToken(user._id), 'refresh': await GenerateRefreshToken(user._id) })
        res.setHeader(`Set-Cookie`, `${process.env.TOKEN_NAME}=${token}; Secure; HttpOnly; Path=/; SameSite=Strict; Expires=${new Date(new Date().getTime() + parseInt(process.env.COOKIE_EXPIRES_IN))}`)
        return res.status(200).json({ msg: "Successful Login", uid: user._id });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: "Try again later" })
    }
})


router.post('/register', async (req, res) => {
    try {
        const uname = req.body.username
        const passwd = req.body.password

        const user = await User.findOne({ username: uname }).collation({ locale: 'en_US', strength: 1 })
        if (user) return res.status(200).json({ msg: "User already exists" })
        const obj = new User({
            username: uname,
            password: passwd,
        })
        await obj.save()
        return res.status(201).json({ msg: "Successful Registeration" });
    }
    catch (err) {
        console.log("ERROR \n\n\n: ", err)
        return res.sendStatus(500);
    }
})


router.post('/logout', auth, async (req, res) => {
    try {
        // Delete Refresh token
        const user = await User.findById(req.uid)
        if (user === null) {
            // No such user Exists
            res.setHeader(`Set-Cookie`, `${process.env.TOKEN_NAME}=${null}; Secure; HttpOnly; Path=/; SameSite=Strict; Expires=${new Date(null)}`)
            return res.status(401).json({ msg: "No such User Exists; Unauthorized Access" })
        }

        //User found
        user.refresh = ""
        await user.save()
        res.setHeader(`Set-Cookie`, `${process.env.TOKEN_NAME}=${null}; Secure; HttpOnly; Path=/; SameSite=Strict; Expires=${new Date(null)}`)
        return res.status(201).json({ msg: "success" });
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ msg: 'failure' })
    }
})


router.put('/refresh', auth, (req, res) => {
    try {
        // User is Authanticated
        return res.status(200).json({ msg: "User is Authorized" })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ msg: 'failure' })
    }
})


module.exports = router