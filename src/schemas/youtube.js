const { model, Schema } = require("mongoose");

let youtube = new Schema({
  Guild: String,
  ID: String,
  Channel: String,
  Message: String,
  Latest: Array,
  PingRole: String,
});

module.exports = model("youtube", youtube);
