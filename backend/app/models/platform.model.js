const mongoose = require("mongoose");

const Platform = mongoose.model(
  "Platform",
  new mongoose.Schema({
    name: String
  })
);

module.exports = Platform;
