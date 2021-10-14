const db = require("../models");
const Role = db.role;
const Platform = db.platform;
const PlatformAccount = db.platform_account;
const JobType = db.job_type;
const Job = db.job;
const { IgApiClient } = require("instagram-private-api");

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
  const platforms = await Platform.find({});
  console.log(platforms);
  res.status(200).send(platforms);
};

exports.get_job_types = async (req, res) => {
  const platform_account_id = req.query.platformAccountId;
  const platform_account = await PlatformAccount.findOne({
    _id: platform_account_id,
  });
  const { platform } = platform_account;
  const job_types = await JobType.find({ platform: platform });
  res.status(200).send(job_types);
};

exports.add_platform_account = (req, res) => {
  new PlatformAccount({
    username: req.body.username,
    encrypted_password: req.body.password,
    owner: req.userId,
    platform: req.body.platformId,
  }).save((err) => {
    if (err) {
      console.log("Error while adding platform account");
      console.log("error", err);
      res
        .status(200)
        .send({ ok: false, message: "Error while adding a platform account" });
    }
    console.log("Platform account added successfully");
    res
      .status(200)
      .send({ ok: true, message: "Platform account added successfully" });
  });
};

exports.add_job = (req, res) => {
  new Job({
    target_item: "nessuno",
    snapshot_data: [],
    type: req.body.jobType,
    platform_account: req.body.platformAccountId,
    owner: req.userId,
  }).save((err) => {
    if (err) {
      console.log("Error while adding job");
      console.log("error", err);
      res.status(200).send({ ok: false, message: "Error while adding a job" });
    }
    console.log("Job added successfully");
    res.status(200).send({ ok: true, message: "Job added successfully" });
  });
};

exports.monitor_followers = async (req, res) => {
  const ig = new IgApiClient();
  ig.state.generateDevice("sharepizza");
  //ig.state.proxyUrl = "http://127.0.0.1:8083/";
  //ig.state.user_id_mongo = req.userId
  const auth = await ig.account.login("sharepizza", "lamia1a");
  console.log(auth.full_name);
  console.log(auth.pk);
  //const followersFeed = ig.feed.accountFollowers(auth.pk);
  const followersFeed2 = ig.feed.accountFollowing(auth.pk);
  const wholeResponse2 = await followersFeed2.request();
  console.log(wholeResponse2.users.length);
  res.status(200).send({ ok: true, message: "Test completed succesfully" });
};

exports.test = async (req, res) => {
  res.status(200).send({ ok: true, message: "Test completed succesfully" });
};

exports.get_platform_account = async (req, res) => {
  console.log("Getting platform accounts");
  res
    .status(200)
    .send(
      await PlatformAccount.find({ owner: req.userId }).populate("platform")
    );
};

exports.get_job = async (req, res) => {
  console.log("Getting jobs");
  res.status(200).send(
    await Job.find({
      owner: req.userId,
      platform_account: req.query.platformAccountId,
    }).populate("type")
  );
};

exports.run_job = async (req, res) => {
  const { userId } = req;
  const { platformAccountId, jobId } = req.query;
  console.log("here");
  console.log(userId);
  console.log(platformAccountId);
  console.log(jobId);

  const ig = new IgApiClient();

  const platformAccount = await PlatformAccount.findOne({
    owner: userId,
    _id: platformAccountId,
  });
  ig.state.generateDevice(platformAccount.username);

  //ig.state.proxyUrl = "http://127.0.0.1:8083/";
  //ig.state.user_id_mongo = userId

  const auth = await ig.account.login(
    platformAccount.username,
    platformAccount.encrypted_password
  );
  console.log(auth.full_name);
  console.log(auth.pk);
  //const followersFeed = ig.feed.accountFollowers(auth.pk);
  const followersFeed = ig.feed.accountFollowing(auth.pk);
  const { users: updated_followers } = await followersFeed.request();

  const job = await Job.findOne({
    _id: jobId,
    owner: userId,
    platform_account: platformAccountId,
  });
  const { snapshot_data: old_followers } = job;

  let gained_followers = updated_followers.filter(
    (x) => !old_followers.some((y) => y.pk === x.pk)
  );
  let loosed_followers = old_followers.filter(
    (x) => !updated_followers.some((y) => y.pk === x.pk)
  );
  console.log(
    `Gained: ${gained_followers.length} - Lossed: ${loosed_followers.length}`
  );

  job.snapshot_data = updated_followers;
  job.save((err) => {
    if (err) {
      console.log("Error while updating job");
      console.log("error", err);
      res.status(200).send({ ok: false, message: "Error while updating a job" });
    }
    console.log("Job updated successfully");
    res.status(200).send({ ok: true, message: "Job added successfully" });
  });
};
