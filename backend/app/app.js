require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const api = require("./api")
const { default: mongoose } = require("mongoose")
const cookieParser = require('cookie-parser')
const app = express()


mongoose.set('strictQuery', true)// will not search by non-attributes of a schema, i.e attributes not present in schema
mongoose.connect(process.env.DATABASE_URL)//connecition 

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


app.use(morgan('dev')) // outputs on console errors, any request 
app.use(express.json()) // It parses the data send to us using json objects, basically we can access json data/objects
app.use(cookieParser())// parses the cookies send by client/front-end
app.use(express.urlencoded({ extended: false }))
/* 
    Urlencoded: data send to server using forms is by default encoded using url-encoding which is of format x-www-form-urlencoded (it's Content-Type)
                we can also send such data using api just by  changing content-type : application/json to x-www-form-urlencoded

    extended: false => uses query-string library for parsing, but that library cannot parse nested parameters send to server using forms/api call 
    extended: true => uses qs library for parsing, it can parse nested parameters into nested objects 
*/


app.use('/api', api)

module.exports = app