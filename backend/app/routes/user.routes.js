const { authJwt, igClient } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/platform/all", controller.get_platforms)

  app.get("/api/jobs_types/all", controller.get_job_types)

  app.get("/api/event/all", [authJwt.verifyToken], controller.get_events)

  app.post("/api/platform_account/add", [authJwt.verifyToken], controller.add_platform_account)

  app.post("/api/platform_account/del", [authJwt.verifyToken], controller.delete_platform_account)

  app.post("/api/job/add", [authJwt.verifyToken], controller.add_job)

  app.post("/api/job/del", [authJwt.verifyToken], controller.delete_job)

  app.get("/api/platform_account/all", [authJwt.verifyToken], controller.get_platform_account)

  app.get("/api/job/all", [authJwt.verifyToken], controller.get_job)

  app.get("/api/job/run", [authJwt.verifyToken], controller.run_job)

  app.get("/api/job/run/all", [authJwt.verifyToken], controller.run_all_job)

  app.get("/api/platform_account/users/search", [authJwt.verifyToken, igClient.getClient], controller.search_users)

  app.get("/api/test", [authJwt.verifyToken], controller.test);

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};
