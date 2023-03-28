require("dotenv").config()
const app = require("./app/app")

port = process.env.PORT || 5000;

app.listen(port, "0.0.0.0", (err) => {
    if (err) console.log("Error occured during connection ", err)
    else console.log(`New Connection established at port ${port} ....`)
})