const express = require("express");
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.json());

const db = require("../models");
const Role = db.role;
const Platform = db.platform
const JobType = db.job_type

const dbConfig = process.env.NODE_ENV == "prod" ? require("../config/db.prod.config") : require("../config/db.config")

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

app.get("/", (req, res) => {
    res.json({ message: "Welcome to stalker_console application." });
});

// routes
require('../routes/auth.routes')(app);
require('../routes/user.routes')(app);

// set port, listen for requests
const PORT = 8090;
app.listen(PORT, () => {
  console.log(`Web Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });

  Platform.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Platform({
        name: "tiktok"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'tiktok' to platforms collection");
      });

      new Platform({
        name: "instagram"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'instagram' to platforms collection");
      });
    }
  });

  JobType.estimatedDocumentCount(async (err, count) => {
    if (!err && count === 0) {
      new JobType({
        name: "Follower Monitor",
        description: "Check periodically if an users loses or gain new followers",
        platform: await Platform.findOne({name:"instagram"})
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Follower Monitor' to job types collection");
      });
    }
  });
}
