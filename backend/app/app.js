require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const api = require("./api")
const auth = require("./auth")
const { default: mongoose } = require("mongoose")
const cookieParser = require('cookie-parser')
const { urlencoded } = require("express")
const app = express()


mongoose.connect(process.env.DATABASE_URL)//connecition 
mongoose.set('strictQuery', false)

// Only to check if database is connected or not 
const db = mongoose.connection
db.on("error", (err) => console.log(err))
db.once('open', () => console.log("SUCCESSFUL CONNECTION TO DEATABASE"))

app.use(function (req, res, next) {
    res.header('Content-Type', 'application/json; charset=UTF-8')
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Methods', "GET, POST, DELETE, PUT, OPTIONS, PATCH")
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With,Content-Type, Accept')
    res.header('Access-Control-Allow-Origin', "http://localhost:3000")
    next()
})


app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())


app.use('/api', api)
app.use('/auth', auth)

module.exports = app