const mongoose = require("mongoose")

const tokenSchema = new mongoose.Schema({
    userId: {type: String, ref: "User", required: true},
    emailToken: {type: String, required: true}
});

const TokenModel = mongoose.model('Token', tokenSchema);

module.exports = TokenModel;