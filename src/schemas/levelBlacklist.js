const { model, Schema } = require("mongoose");

let levelBlacklist = new Schema({
	Guild: String,
	Channel: String,
});

module.exports = model("levelBlacklist", levelBlacklist);