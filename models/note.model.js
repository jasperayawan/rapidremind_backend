const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    userId: {type: String, ref: "User", required: true},
    content: {type: Object, required: true},
}, {
    timestamps: true
});

const noteModel = mongoose.model('Note', noteSchema);

module.exports = noteModel;