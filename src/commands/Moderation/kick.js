const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  EmbedBuilder,
  PermissionsBitField,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a member from the server.")
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("Select the member to kick.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Specify a reason for the kick.")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const kickUser = interaction.options.getUser("member");
    const kickuserId = kickUser.id;
    const kickMember = await interaction.guild.members.fetch(kickuserId);

    let reason = interaction.options.getString("reason") || "Unknown reason";

    // Defining Embeds

    const dmEmbed = new EmbedBuilder()
      .setDescription(
        `🔨 You were kicked from **${interaction.guild.name}**.\nReason: ${reason}.`
      )
      .setColor("Red");

    const sucess = new EmbedBuilder()
      .setDescription(
        `<:check:1082334169197187153> **${kickMember.user.tag}** was kicked.\nReason: ${reason}.`
      )
      .setColor("Green");

    const fail = new EmbedBuilder()
      .setDescription(
        `<:cross:1082334173915775046> Unable to kick ${kickMember.user.tag}.`
      )
      .setColor("Red");

    const roleIssue = new EmbedBuilder()
      .setDescription(
        `<:cross:1082334173915775046> Unable to kick ${kickMember.user.tag} due to role hierarchy.`
      )
      .setColor("Red");

    // Execution Code

    if (!kickMember.kickable)
      return await interaction.reply({ embeds: [roleIssue], ephemeral: true });

    try {
      await kickMember.send({ embeds: [dmEmbed] }).catch(() => {});

      await kickMember.kick({ reason: reason });

      await interaction.reply({ embeds: [sucess] });
    } catch (err) {
      await interaction.reply({ embeds: [fail], ephemeral: true });
    }
  },
};
