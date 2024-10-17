const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const afkSchema = require("../../schemas/afkSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("afk")
    .setDescription("Set your status as AFK.")
    .addStringOption((option) =>
      option.setName(`message`).setDescription(`The reason for going AFK.`)
    ),
  async execute(interaction) {
    const { options } = interaction;

    const Data = await afkSchema.findOne({
      Guild: interaction.guild.id,
      User: interaction.user.id,
    });

    const errEmbed = new EmbedBuilder()
      .setColor("Red")
      .setDescription(
        `<:cross:1082334173915775046> Your status is already set to AFK!`
      );

    if (Data)
      return await interaction.reply({ embeds: [errEmbed], ephemeral: true });
    else {
      const message = options.getString(`message`);

      const filter = require("../../utils/filter.json");

      for (var i = 0; i < filter.words.length; i++) {
        const filtered = await message.toLowerCase();
        if (filtered.includes(filter.words[i])) {
          const blacklisted = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `<:cross:1082334173915775046> Your AFK message contains a blacklisted word!`
            );

          interaction.reply({ embeds: [blacklisted], ephemeral: true });
        }
      }

      const nickname = interaction.member.nickname || interaction.user.username;
      await afkSchema.create({
        Guild: interaction.guild.id,
        User: interaction.user.id,
        Message: message,
        Nickname: nickname,
      });

      const name = `[AFK] ${nickname}`;
      await interaction.member.setNickname(`${name}`).catch((err) => {
        return;
      });

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setDescription(
          `<:check:1082334169197187153> Your status has been set to afk within the server.`
        );

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
