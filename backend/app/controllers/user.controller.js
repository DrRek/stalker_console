const db = require("../models");
const Role = db.role;
const Platform = db.platform;
const PlatformAccount = db.platform_account;
const JobType = db.job_type;
const Job = db.job;
const Event = db.event;
const { IgApiClient } = require("instagram-private-api");
const { getInstagramClient } = require("./instagram.controller");
const differenceBy = require("lodash.differenceby");
const uniqueBy = require("lodash.uniqby");

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
    active: true,
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
    active: true,
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

exports.delete_job = async (req, res) => {
  await Job.findOneAndUpdate(
    {
      owner: req.userId,
      platform_account: req.body.platformAccountId,
      _id: req.body.jobId,
    },
    {
      active: false,
    }
  );
  res.status(200).send({
    ok: true,
    message: "Job Deleted",
  });
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
      await PlatformAccount.find({ owner: req.userId, active: true }).populate(
        "platform"
      )
    );
};

exports.get_job = async (req, res) => {
  console.log("Getting jobs");
  res.status(200).send(
    await Job.find({
      owner: req.userId,
      platform_account: req.query.platformAccountId,
      active: true,
    }).populate("type")
  );
};

exports.delete_platform_account = async (req, res) => {
  await PlatformAccount.findOneAndUpdate(
    {
      owner: req.userId,
      _id: req.body.platformAccountId,
    },
    {
      active: false,
    }
  );
  res.status(200).send({
    ok: true,
    message: "Platform Account Deleted",
  });
};

const repeater = async (callback, discriminator, n = 3) => {
  let iterator = 1;
  const times = 3;
  let results = [];

  do {
    const rawData = await callback();
    //rawData.forEach(i => i.pk==974687150 && console.log("sara ci sta"))
    results = [...results, ...rawData];
    iterator++;
  } while (iterator <= times);

  return uniqueBy(results, discriminator);
};

const itemsIterator = async (feed) => {
  const results = [];
  do {
    const currentPage = await feed.items();
    results.push(...currentPage);
  } while (feed.isMoreAvailable());
  return results;
};

const get_instagram_followers = async (ig, pk) => {
  return repeater(async () => {
    const followers_feed = ig.feed.accountFollowers(pk);
    return itemsIterator(followers_feed);
  }, "pk");
};

const get_instagram_following = async (ig, pk) => {
  return repeater(async () => {
    const followers_feed = ig.feed.accountFollowing(pk);
    return itemsIterator(followers_feed);
  }, "pk");
};

exports.get_events = async (req, res) => {
  res.status(200).send(
    await Event.find({
      owner: req.userId,
      platform_account: req.query.platformAccountId
    }).sort({ createdAt: "desc"}).populate("job")
  );
}

exports.run_all_job = async (req, res) => {
  res.status(200).send({
    ok: true,
    message: "Running",
  });

  console.log("run_all_job");
  const { userId } = req;
  console.log(userId);

  const platformAccounts = await PlatformAccount.find({
    owner: userId,
    active: true,
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
      active: true,
    }).populate("type");

    if (jobs.length == 0) return;

    switch (platform.name) {
      case "instagram":
        const igClient = await getInstagramClient(platformAccount);
        jobs.forEach(async (job) => {
          const { type, target_item } = job;

          if (type.name == "Following Monitor") {
            const new_data = await get_instagram_following(
              igClient,
              target_item.pk
            );
            const { snapshot_data: old_data } = job;

            const gained_data = differenceBy(new_data, old_data, "pk");
            const loosed_data = differenceBy(old_data, new_data, "pk");

            job.snapshot_data = new_data;
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

            //If it's the first time running the job
            if (!old_data || old_data.length == 0) return;

            gained_data.forEach((x) => {
              new Event({
                owner: userId,
                platform_account: pId,
                job: job._id,
                name: `Following`,
                description: `${job.target_item.username} has started following ${x.username}`,
                img: x.profile_pic_url,
              }).save((err) => {
                if (err) {
                  console.log("Error while adding an Event");
                  console.log("error", err);
                }
                console.log("Event added successfully");
              });
            });

            loosed_data.forEach((x) => {
              new Event({
                owner: userId,
                platform_account: pId,
                job: job._id,
                name: `Unfollowing`,
                description: `${job.target_item.username} has stoped following ${x.username}`,
                img: x.profile_pic_url,
              }).save((err) => {
                if (err) {
                  console.log("Error while adding an Event");
                  console.log("error", err);
                }
                console.log("Event added successfully");
              });
            });
          } else if (type.name == "Follower Monitor") {
            const new_data = await get_instagram_followers(
              igClient,
              target_item.pk
            );
            const { snapshot_data: old_data } = job;

            const gained_data = differenceBy(new_data, old_data, "pk");
            const loosed_data = differenceBy(old_data, new_data, "pk");

            job.snapshot_data = new_data;
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

            //If it's the first time running the job
            if (!old_data || old_data.length == 0) return;

            gained_data.forEach((x) => {
              new Event({
                owner: userId,
                platform_account: pId,
                job: job._id,
                name: `Followed`,
                description: `${job.target_item.username} has been followed by ${x.username}`,
                img: x.profile_pic_url,
              }).save((err) => {
                if (err) {
                  console.log("Error while adding an Event");
                  console.log("error", err);
                }
                console.log("Event added successfully");
              });
            });

            loosed_data.forEach((x) => {
              new Event({
                owner: userId,
                platform_account: pId,
                job: job._id,
                name: `Unfollowed`,
                description: `${job.target_item.username} has been unfollowed by ${x.username}`,
                img: x.profile_pic_url,
              }).save((err) => {
                if (err) {
                  console.log("Error while adding an Event");
                  console.log("error", err);
                }
                console.log("Event added successfully");
              });
            });
          } else {
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
  const { igClient } = req;
  const { userSearch } = req.query;

  const users = await igClient.user.search(userSearch);

  res.status(200).send({ ok: true, data: users });
};

exports.run_job = async (req, res) => {
  res.status(200).send({
    ok: false,
    message: "Not implemented yet",
  });
  return;
};
