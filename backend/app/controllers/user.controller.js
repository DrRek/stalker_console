const db = require("../models");
const Role = db.role;
const Platform = db.platform
const PlatformAccount = db.platform_account

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
};

exports.get_platforms = async (req, res) => {
    const platforms = await Platform.find({})
    console.log(platforms)
    res.status(200).send(platforms)
}

exports.add_platform_account = (req, res) => {
    console.log("Adding platform account")
    console.log(`${req.userId} ${req.platformId}${req.password}${req.username}`)
    userId = req.userId
    platformId = req.platformId
    new PlatformAccount({
        username: req.username,
        encrypted_password: req.password,
        owner: req.userId,
        platform: req.platformId
    }).save(err => {
        if (err) {
            console.log("Error while adding platform account")
            console.log("error", err);
            res.status(200).send({ok: false, message: "Error while adding a platform account"})
        }

        console.log("Platform account added successfully")
        res.status(200).send({ok: true, message: "Platform account added successfully"})
    });
}