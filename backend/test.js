const { IgApiClient } = require("instagram-private-api");
const { existsSync, readFileSync, writeFileSync } = require("fs");

(async () => {
  const ig = new IgApiClient();
  ig.state.proxyUrl = "http://127.0.0.1:8080/";
  ig.state.generateDevice("sharepizza");
  // this will set the auth and the cookies for instagram
  await readState(ig);
  // this logs the client in
  await loginToInstagram(ig);

  const followersFeed2 = ig.feed.accountFollowing("sharepizza");

  let wholeResponse2 = [];
  followersFeed2.items$.subscribe(
    (followers) => {
      console.log(followers);
      wholeResponse2 = [...wholeResponse2, ...followers];
    },
    (error) => console.error(error),
    () => console.log(wholeResponse2)
  );
})();

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
    "state.json",
    JSON.stringify({
      cookies: JSON.stringify(cookies),
      state,
    }),
    { encoding: "utf8" }
  );
}

async function readState(ig) {
  if (!existsSync("state.json")) return;
  // normal reading of state for the instagram-api
  const { cookies, state } = JSON.parse(
    readFileSync("state.json", { encoding: "utf8" })
  );
  ig.state.deviceString = state.deviceString;
  ig.state.deviceId = state.deviceId;
  ig.state.uuid = state.uuid;
  ig.state.phoneId = state.phoneId;
  ig.state.adid = state.adid;
  ig.state.build = state.build;
  await ig.state.deserializeCookieJar(cookies);
}

async function loginToInstagram(ig) {
  ig.request.end$.subscribe(() => saveState(ig));
  await ig.account.login("sharepizza", "lamia1a");
}
