const { IgApiClient } = require('instagram-private-api');

(async () => {
    const ig = new IgApiClient();
    ig.state.generateDevice("sharepizza");
    ig.state.proxyUrl = "http://127.0.0.1:8083/";
    const auth = await ig.account.login("sharepizza", "lamia1a");
    console.log(auth.full_name)
    console.log(auth.pk)
    //Persone che mi seguono
    //const followersFeed = ig.feed.accountFollowers(auth.pk);
    //const wholeResponse = await followersFeed.request();
    //console.log(wholeResponse.users.length);
    //Persone che seguo
    const followersFeed2 = ig.feed.accountFollowing(auth.pk);
    const wholeResponse2 = await followersFeed2.request();
    console.log(wholeResponse2.users.length);
  })();