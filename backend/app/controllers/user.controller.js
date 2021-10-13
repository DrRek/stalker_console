const db = require("../models");
const Role = db.role;
const Platform = db.platform
const PlatformAccount = db.platform_account
const { IgApiClient } = require('instagram-private-api');

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
    new PlatformAccount({
        username: req.body.username,
        encrypted_password: req.body.password,
        owner: req.userId,
        platform: req.body.platformId,
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

exports.monitor_followers = async (req, res) => {
    const ig = new IgApiClient();
    ig.state.generateDevice("sharepizza");
    //ig.state.proxyUrl = "http://127.0.0.1:8083/";
    //ig.state.user_id_mongo = req.userId
    const auth = await ig.account.login("sharepizza", "lamia1a");
    console.log(auth.full_name)
    console.log(auth.pk)
    //const followersFeed = ig.feed.accountFollowers(auth.pk);
    const followersFeed2 = ig.feed.accountFollowing(auth.pk);
    const wholeResponse2 = await followersFeed2.request();
    console.log(wholeResponse2.users.length);
    res.status(200).send({ok: true, message: "Test completed succesfully"})
}

exports.test = async (req, res) => {
    const ig = new IgApiClient();
    ig.state.generateDevice("sharepizza");
    //ig.state.proxyUrl = "http://127.0.0.1:8083/";
    //ig.state.user_id_mongo = req.userId
    const auth = await ig.account.login("sharepizza", "lamia1a");
    console.log(auth.full_name)
    console.log(auth.pk)
    //const followersFeed = ig.feed.accountFollowers(auth.pk);
    const followersFeed2 = ig.feed.accountFollowing(auth.pk);
    const wholeResponse2 = await followersFeed2.request();
    console.log(wholeResponse2.users.length);
    res.status(200).send({ok: true, message: "Test completed succesfully"})
}

exports.get_platform_account = async (req, res) => {
    console.log("Getting platform accounts")
    res.status(200).send(await PlatformAccount.find({owner: req.userId}).populate("platform"))
}