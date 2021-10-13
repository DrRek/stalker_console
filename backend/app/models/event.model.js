const mongoose = require("mongoose");

const Event = mongoose.model(
    "Event",
    new mongoose.Schema({
        owner:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        job:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job"
        },
        name: String,
        description: String,
        img: String,
    })
);

module.exports = Event;
