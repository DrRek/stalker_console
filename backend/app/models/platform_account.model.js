const mongoose = require("mongoose");

const PlatformAccount = mongoose.model(
    "PlatformAccount",
    new mongoose.Schema({
        username: String,
        encrypted_password: String,
        platform:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Platform"
        },
        owner:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    })
);

module.exports = PlatformAccount;
