const mongoose = require("mongoose");

const JobType = mongoose.model(
    "JobType",
    new mongoose.Schema({
        platform:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Platform"
        },
        name: String,
        description: String,
    })
);

module.exports = JobType;
