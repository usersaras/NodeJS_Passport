const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,

    }
}, {timestamps: true} )

const usersModel = mongoose.model('users', usersSchema);

module.exports = (usersModel);