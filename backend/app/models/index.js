const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.platform = require("./platform.model");
db.platform_account = require("./platform_account.model")
db.job = require("./job.model")
db.job_type = require("./job_type.model")
db.event = require("./event.model")

db.ROLES = ["user", "admin", "moderator"];
db.PLATFORMS = ["instagram", "tiktok"]

module.exports = db;
