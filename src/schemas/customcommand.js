const { model, Schema } = require("mongoose");

let customCommandSchema = new Schema({
	GuildID: String,
	Keyword: String,
	Reply: String,
});

module.exports = model("CustomCommand", customCommandSchema);