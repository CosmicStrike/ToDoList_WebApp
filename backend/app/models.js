const mongoose = require("mongoose")
const Schema = mongoose.Schema


const userSchema = Schema({
    username: {
        type: String,
        required: true,
        min: 4,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 4
    },
    refresh: {
        type: String,
        unique: true
    }
});


const taskSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true
    },

    description: String,

    date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    deadline: {
        type: Date,
        required: true
    }
})


module.exports.user = mongoose.model("user", userSchema)
module.exports.task = mongoose.model("task", taskSchema)
