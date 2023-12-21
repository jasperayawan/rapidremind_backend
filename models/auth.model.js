const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {type: String, require: [true, 'username is required']},
    email: {type: String, require: [true, 'email is required'], unique: true},
    password: {type: String, require: [true, 'password is required']}
},{
    timestamps: true 
});

const userModel = mongoose.model('User', UserSchema);

module.exports = userModel;