const { model, Schema } = require(`mongoose`);

let levelSchema = new Schema({
  Guild: String,
  Channel: String,
  Toggle: Boolean,
  User: String,
  XP: Number,
  Level: Number,
  LevelRewards: [
    {
      Level: Number,
      Role: {
        type: Schema.Types.ObjectId,
        ref: "Role"
      }
    }
  ]
});

module.exports = model("level", levelSchema);
