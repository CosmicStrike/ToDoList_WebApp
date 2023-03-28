const express = require("express")
const mongoose = require("mongoose")
const User = require('./models').user
const Task = require('./models').task
const TokenizeUser = require('../middlewares/jwt').TokenizeUser
const RequireToken = require('../middlewares/jwt').RequireToken
const router = express.Router()

router.post('/check', (req, res) => {
    console.log('Login', ' ', req.body.msg, new Date().toTimeString())
    return res.status(200).json({ msg: 'success' });
})
// TODO: Access and Refresh Token - JWT
router.get('/', RequireToken, async (req, res) => {
    try {
        // console.log("SDSD")
        // console.log(req.username)
        const user = await User.findOne({ username: req.username })

        const data = await Task.find({ user: user._id }, '_id user title description deadline').sort({ deadline: '1' })
        // console.log((data))

        return res.status(201).json({ msg: 'success', data: data })
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(500);
    }

})


router.post('/', RequireToken, async (req, res) => {
    try {
        const date = new Date(req.body.date)
        const user = await User.findOne({ username: req.username })
        // console.log(user)
        const task = new Task({
            user: user._id,
            title: req.body.title,
            description: req.body.description,
            date: Date(),
            deadline: date
        })

        // console.log(task)
        await task.save()
        res.status(201).json({ msg: 'success', id: task._id })
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
})


router.delete('/', RequireToken, async (req, res) => {
    try {
        const id = req.body.todo
        await Task.deleteOne({ _id: id })
        return res.status(201).json({ msg: "success" })
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

        const token = TokenizeUser(user._id, user.username)
        const expireAfter = 4 // Expires after 4 days
        res.setHeader(`Set-Cookie`, `token=${token}; Secure; HttpOnly; Path=/; SameSite=Strict; Expires=${new Date(new Date().getTime() + expireAfter * 24 * 60 * 60 * 1000)}`)
        return res.status(200).json({ msg: "success" });

    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: "Try again later" })
    }
})


router.post('/register', async (req, res) => {
    try {
        // console.log("Request obtain")
        const uname = req.body.username
        const passwd = req.body.password

        const user = await User.findOne({ username: uname }).collation({ locale: 'en_US', strength: 1 }).exec()
        if (user) return res.status(200).json({ msg: "User already exists" })
        const obj = new User({
            username: uname,
            password: passwd,
        })
        await obj.save()
        // console.log(obj._id)
        return res.status(201).json({ msg: "success" });
    }
    catch (err) {
        console.log("ERROR \n\n\n: ", err)
        return res.sendStatus(500);
    }
})

module.exports = router



    // const db = mongoose.connection.db;
    // const collections = await db.listCollections().toArray();
    // // Create an array of collection names and drop each collection
    // collections
    //     .map((collection) => collection.name)
    //     .forEach(async (collectionName) => {
    //         db.dropCollection(collectionName);
    //     });
    // console.log("DATABASE CONTENTS : ")
    // console.log(await User.find({}))
    // res.send("Database deleted succussfully")