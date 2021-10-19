const { IgApiClient } = require("instagram-private-api");
const db = require("../models");
const { existsSync, readFileSync, writeFileSync } = require("fs");

let igClients = {};

exports.getInstagramClient = async (platformAccount) => {
  if (igClients[platformAccount._id]) {
    return igClients[platformAccount._id];
  } else {
    const ig = new IgApiClient();
    ig.state.proxyUrl = "http://127.0.0.1:8083/";
    ig.state.generateDevice(platformAccount.username);
    ig.state.user_id_mongo = platformAccount.owner;
    // this will set the auth and the cookies for instagram
    await readState(ig);
    // this logs the client in
    ig.request.end$.subscribe(() => saveState(ig));
    await ig.account.login(
      platformAccount.username,
      platformAccount.encrypted_password
    );

    igClients[platformAccount._id] = ig;
    return ig;
  }
};

async function saveState(ig) {
  // the normal saving of cookies for te instagram-api
  const cookies = await ig.state.serializeCookieJar();
  const state = {
    deviceString: ig.state.deviceString,
    deviceId: ig.state.deviceId,
    uuid: ig.state.uuid,
    phoneId: ig.state.phoneId,
    adid: ig.state.adid,
    build: ig.state.build,
  };
  writeFileSync(
    getClientFileName(ig),
    JSON.stringify({
      cookies: JSON.stringify(cookies),
      state,
    }),
    { encoding: "utf8" }
  );
}

async function readState(ig) {
  if (!existsSync(getClientFileName(ig))) return;
  // normal reading of state for the instagram-api
  const { cookies, state } = JSON.parse(
    readFileSync(getClientFileName(ig), { encoding: "utf8" })
  );
  ig.state.deviceString = state.deviceString;
  ig.state.deviceId = state.deviceId;
  ig.state.uuid = state.uuid;
  ig.state.phoneId = state.phoneId;
  ig.state.adid = state.adid;
  ig.state.build = state.build;
  await ig.state.deserializeCookieJar(cookies);
}

function getClientFileName(ig) {
  return `saved_states/${ig.state.deviceId}`;
}
