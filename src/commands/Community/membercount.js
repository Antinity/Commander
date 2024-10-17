const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("membercount")
    .setDescription("Shows the amount of members in the server."),
  async execute(interaction) {

    // Get guild and its members
    const guild = interaction.guild;
    const members = guild.members.cache;

    // Filter members by status and bot flag
    const onlineMembers = members.filter(
        (member) =>
          member.presence?.status === 'online' ||
          member.presence?.status === 'idle' ||
          member.presence?.status === 'dnd'
      );
      const bots = members.filter((member) => member.user.bot);

    const message = new EmbedBuilder()
      .setDescription(`\👤 **${guild.memberCount}** total members in **${interaction.guild.name}** and **${onlineMembers.size}** online.`)
      .setColor("Blue")
      .setTimestamp()

    await interaction.reply({ embeds: [message] });
  },
};
