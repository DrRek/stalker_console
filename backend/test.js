const { IgApiClient } = require("instagram-private-api");

(async () => {
  const ig = new IgApiClient();
  ig.state.generateDevice("sharepizza");
  //ig.state.proxyUrl = "http://127.0.0.1:8083/";
  //ig.state.user_id_mongo = "test"
  const auth = await ig.account.login("sharepizza", "lamia1a");
  console.log(auth.full_name);
  console.log(auth.pk);
  //Persone che mi seguono
  //const followersFeed = ig.feed.accountFollowers(auth.pk);
  //const wholeResponse = await followersFeed.request();
  //console.log(wholeResponse.users.length);
  //Persone che seguo
  const followersFeed2 = ig.feed.accountFollowing("sharepizza");

  let wholeResponse2 = [];
  followersFeed2.items$.subscribe(
    followers => {
      console.log(followers)
      wholeResponse2 = [...wholeResponse2, ...followers]
    },
    error => console.error(error),
    () => console.log(wholeResponse2),
  );
})();
