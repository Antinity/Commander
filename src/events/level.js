const { Events, EmbedBuilder } = require(`discord.js`);
const levelSchema = require("../schemas/level");
const blckSch = require("../schemas/levelBlacklist");
const cooldownDuration = process.env.Cooldown;

const cooldowns = new Set();

module.exports = {
  once: false,
  name: Events.MessageCreate,
  async execute(message) {
    const { guild, author } = message;
    if (!guild || author.bot) return;

    if (cooldowns.has(author.id)) {
      return;
    }
    const res1 = await blckSch.find({
      Guild: message.guild.id,
    });

    const blckChs = res1.map((e) => e.Channel);

    if (blckChs.includes(message.channel.id)) return;

    if (message.createdTimestamp < Date.now() - cooldownDuration) return;

    levelSchema.findOne(
      { Guild: guild.id, User: author.id },
      async (err, data) => {
        if (err) throw err;

        if (!data) {
          levelSchema.create({
            Guild: guild.id,
            User: author.id,
            XP: 0,
            Level: 0,
            Toggle: true,
            Channel: "Unknown",
          });
        }
      }
    );

    const give = 1;

    const data = await levelSchema.findOne({
      Guild: guild.id,
      User: author.id,
    });

    let channel;
    if (data && data.Channel) {
      channel = guild.channels.cache.get(data.Channel) || message.channel;
    } else {
      channel = message.channel;
    }

    if (!data || data.Toggle === false) return;

    const requiredXP = data.Level * data.Level * 20 + 20;

    if (data.XP + give >= requiredXP) {
      data.XP += give;
      data.Level += 1;
      await data.save();

      if (!channel) return;

      channel.send({
        content: `:tada: Congratulations ${author}, you reached level ${data.Level}.`,
      });

      cooldowns.add(author.id);
      setTimeout(() => {
        cooldowns.delete(author.id);
      }, cooldownDuration);
    } else {
      data.XP += give;
      data.save();
    }
  },
};
