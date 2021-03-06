const mongoose = require("mongoose");

const Job = mongoose.model(
    "Job",
    new mongoose.Schema({
        target_item: {},
        snapshot_data: [],
        type: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "JobType"
        },
        platform_account:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PlatformAccount"
        },
        owner:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        active: Boolean
    }, {
        timestamps: true
    })
);

module.exports = Job;
