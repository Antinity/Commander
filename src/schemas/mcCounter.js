const { model, Schema } = require(`mongoose`);

let mcCounter = new Schema({
  Guild: String,
  Channel: String,
  IP: String,
  Bedrock: Boolean,
  Title: String,
});

module.exports = model("mcCounter", mcCounter);
