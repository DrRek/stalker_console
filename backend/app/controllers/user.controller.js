const db = require("../models");
const Role = db.role;
const Platform = db.platform;
const PlatformAccount = db.platform_account;
const JobType = db.job_type;
const Job = db.job;
const Event = db.event;
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
    target_item: req.body.targetUser,
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
  console.log(
    `User ${
      req.userId
    } at time ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}:`
  );
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

exports.run_all_job = async (req, res) => {
  res.status(200).send({
    ok: true,
  });
  return;

  const { userId } = req;

  const platformAccounts = await PlatformAccount.find({
    owner: userId,
  }).populate("platform");

  platformAccounts.forEach(async (platformAccount) => {
    const {
      _id: pId,
      username,
      encrypted_password,
      platform,
    } = platformAccount;

    const jobs = await Job.find({
      owner: userId,
      platform: pId,
    }).populate("type");

    if (jobs.length == 0) return;

    switch (platform.name) {
      case "instagram":
        const ig = new IgApiClient();
        ig.state.generateDevice(platformAccount.username);
        const auth = await ig.account.login(username, encrypted_password);

        jobs.forEach((job) => {
          const { type, target_item } = job;

          switch (type.name) {
            case "Follower Monitor":
              const feed = ig.feed.accountFollowers(target_item);
              let new_followers = [];
              feed.items$.subscribe(
                (followers) =>
                  (new_followers = [...tot_followers, ...followers]),
                (error) => console.error(error),
                () => {
                  const { snapshot_data: old_followers } = job;

                  const gained_followers = new_followers.filter(
                    (x) => !old_followers.some((y) => y.pk === x.pk)
                  );
                  const loosed_followers = old_followers.filter(
                    (x) => !new_followers.some((y) => y.pk === x.pk)
                  );

                  job.snapshot_data = new_followers;
                  job.save((err) => {
                    if (err) {
                      console.log("Error while updating job");
                      console.log("error", err);
                      res.status(200).send({
                        ok: false,
                        message: "Error while updating a job",
                      });
                    }
                    console.log("Job updated successfully");
                  });

                  gained_followers.forEach((x) => {
                    new Event({
                      owner: userId,
                      platform_account: platformAccountId,
                      job: jobId,
                      name: `Following user ${x.username}`,
                      description: `The monitored user has started following the user ${x.username}`,
                      img: x.profile_pic_url,
                    }).save((err) => {
                      if (err) {
                        console.log("Error while adding an Event");
                        console.log("error", err);
                        res.status(200).send({
                          ok: false,
                          message: "Error while adding an Event",
                        });
                      }
                      console.log("Event added successfully");
                    });
                  });

                  loosed_followers.forEach((x) => {
                    new Event({
                      owner: userId,
                      platform_account: platformAccountId,
                      job: jobId,
                      name: `Unfollowed user ${x.username}`,
                      description: `The monitored user has stoped following the user ${x.username}`,
                      img: x.profile_pic_url,
                    }).save((err) => {
                      if (err) {
                        console.log("Error while adding an Event");
                        console.log("error", err);
                        res.status(200).send({
                          ok: false,
                          message: "Error while adding an Event",
                        });
                      }
                      console.log("Event added successfully");
                    });
                  });
                }
              );
              break;
            default:
              console.err(`JobType ${type.name} not yet fully implemented`);
          }
        });
        break;
      default:
        console.err(`Platform ${platform.name} not yet fully implemented`);
    }
  });
};

exports.search_users = async (req, res) => {
  const { userId, igClient } = req;
  const { platformAccountId, userSearch } = req.query;

  const users = await igClient.user.search(userSearch);

  res.status(200).send({ ok: true, data: users });
};

exports.run_job = async (req, res) => {
  const { userId } = req;
  const { platformAccountId, jobId } = req.query;

  const ig = new IgApiClient();

  const platformAccount = await PlatformAccount.findOne({
    owner: userId,
    _id: platformAccountId,
  });
  ig.state.generateDevice(platformAccount.username);

  ig.state.proxyUrl = "http://127.0.0.1:8083/";
  ig.state.user_id_mongo = userId;

  const auth = await ig.account.login(
    platformAccount.username,
    platformAccount.encrypted_password
  );

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
      res
        .status(200)
        .send({ ok: false, message: "Error while updating a job" });
    }
    console.log("Job updated successfully");
  });

  gained_followers.forEach((x) => {
    new Event({
      owner: userId,
      platform_account: platformAccountId,
      job: jobId,
      name: `Following user ${x.username}`,
      description: `The monitored user has started following the user ${x.username}`,
      img: x.profile_pic_url,
    }).save((err) => {
      if (err) {
        console.log("Error while adding an Event");
        console.log("error", err);
        res
          .status(200)
          .send({ ok: false, message: "Error while adding an Event" });
      }
      console.log("Event added successfully");
    });
  });

  loosed_followers.forEach((x) => {
    new Event({
      owner: userId,
      platform_account: platformAccountId,
      job: jobId,
      name: `Unfollowed user ${x.username}`,
      description: `The monitored user has stoped following the user ${x.username}`,
      img: x.profile_pic_url,
    }).save((err) => {
      if (err) {
        console.log("Error while adding an Event");
        console.log("error", err);
        res
          .status(200)
          .send({ ok: false, message: "Error while adding an Event" });
      }
      console.log("Event added successfully");
    });
  });
};
