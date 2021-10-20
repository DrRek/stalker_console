const mongoose = require("mongoose");

const Event = mongoose.model(
    "Event",
    new mongoose.Schema({
        owner:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        platform_account:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "PlatformAccount"
        },
        job:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job"
        },
        name: String,
        description: String,
        img: String,
    }, {timestamps: true})
);

module.exports = Event;
