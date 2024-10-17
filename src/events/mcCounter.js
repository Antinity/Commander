const { Events, EmbedBuilder } = require("discord.js");
const schema = require("../schemas/mcCounter");

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction) {
    if (interaction.customId != "mcStatus") return;

    const data = await schema.findOne({ Guild: interaction.guild.id });
    if (!data) return;

    const ip = data.IP;
    const bedrock = data.Bedrock;
    const name = data.Title;

    if (!data.Channel)
      await schema.findOneAndDelete({ Guild: interaction.guild.id });

    const url = `https://api.mcsrvstat.us/1/${ip}`;
    if (bedrock === true) url = `https://api.mcsrvstat.us/bedrock/1/${ip}`;

      const res = await fetch(url).then((response) => response.json());

      if (res.offline) {
        const embedOff = new EmbedBuilder()
          .setColor("Red")
          .setTitle(name)
          .addFields(
            {
              name: "Status",
              value: "```🔴 Offline```",
              inline: true,
            },
            {
              name: "Players",
              value: "```Unavailable```",
              inline: true,
            }
          );

        interaction.update({ embeds: [embedOff] });
        return;
      } else {
        const onlineplayers = res.players.online;

        const currentTimeSeconds = Math.floor(Date.now() / 1000);

        const embedOn = new EmbedBuilder()
          .setColor("Blue")
          .setTitle(name)
          .addFields(
            {
              name: "Status",
              value: "```🟢 Online```",
              inline: true,
            },
            {
              name: "Players",
              value: "```" + onlineplayers.toString() + "```",
              inline: true,
            },
            {
              name: "Last updated",
              value: `<t:${currentTimeSeconds}:R>`,
            }
          );

        interaction.update({ embeds: [embedOn] });
      }
  },
};
