const mongoose = require("mongoose");

const Job = mongoose.model(
    "Job",
    new mongoose.Schema({
        created_at: Date,
        last_updated_at: Date,
        target_item: String,
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
        is_deleted: Boolean,
    })
);

module.exports = Job;
