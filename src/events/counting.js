const { Events, EmbedBuilder } = require(`discord.js`);

module.exports = {
  once: false,
  name: Events.MessageCreate,
  async execute(message, client) {
    const countschema = require("../schemas/counting");
    const countdata = await countschema.findOne({ Guild: message.guild.id })

    if (!countdata) return;

    let countchannel = client.channels.cache.get(countdata.Channel);

    if (!countchannel) return;

    if (message.channel.id !== countchannel.id) return;

    if (message.author.bot || message.content === "0" || message.content.startsWith(`*`)) return;

    if (
      (message.content - 1 < countdata.Count) ||
      message.content === countdata.Count ||
      message.content > countdata.Count + 1
    ) {

      if (countdata.Reset === true) {
        countdata.Count = 0;
        const messedup2 = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          `<:cross:1082334173915775046> You messed up the counting game at **${countdata.Count}**. The count has been reset to **0**.`
        );
      message.reply({
        embeds: [messedup2],
      });
      } else {
      try {
        message.react("❌");
      } catch (err) {
        return;
      }
    }
   } else if (message.content - 1 === countdata.Count) {
      countdata.Count += 1;
      try {
        message.react("✅");
      } catch (err) {
        throw err;
      }
    }

    countdata.save();
  },
};
