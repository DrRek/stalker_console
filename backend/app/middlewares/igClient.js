const { IgApiClient } = require("instagram-private-api");
const db = require("../models");
const PlatformAccount = db.platform_account;
const { existsSync, readFileSync, writeFileSync } = require("fs");
const { getInstagramClient } = require("../controllers/instagram.controller")

let igClients = {};

getClient = async (req, res, next) => {
  const { userId } = req;
  const { platformAccountId } = req.query;
  const platformAccount = await PlatformAccount.findOne({
    owner: userId,
    _id: platformAccountId,
  });

  req.igClient = await getInstagramClient(platformAccount)
  next()
};

const igClient = {
  getClient,
};
module.exports = igClient;
