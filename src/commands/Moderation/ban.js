const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const schema = require(`../../schemas/bans`);
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a member from the server.")
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("Select the member to ban.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Specify a reason for the ban.")
    )
    .addStringOption((option) =>
      option
        .setName("duration")
        .setDescription(
          "Leave blank for permanent ban, use 'd', 'h', 'm', 's' for time duration."
        )
    ),
  async execute(interaction) {
    const banUser = interaction.options.getUser("member");
    const banMember = await interaction.guild.members.fetch(banUser.id);

    if (
      !interaction.member.permissions.has(PermissionFlagsBits.BanMembers) &&
      interaction.user.id !== process.env.DeveloperID.split(',')
    ) {
      const PermissionEmbed = new EmbedBuilder()
        .setColor(`Red`)
        .setDescription(
          `<:cross:1082334173915775046> You are not allowed to perform this action.`
        );
      return await interaction.reply({
        embeds: [PermissionEmbed],
        ephemeral: true,
      });
    }

    let reason = interaction.options.getString("reason") || "Unknown reason";

    const optiontime = interaction.options.getString("duration");

    let time = ``;
    if (!optiontime) {
      time = `notime`;
    } else {
      time = ms(optiontime);
    }

    // if its over 1 year or less than 1 second
    if (time > 31556952000 || time < 1000) {
      const timeEmbed = new EmbedBuilder()
        .setColor(`Red`)
        .setDescription(
          `<:cross:1082334173915775046> You cannot ban a member for more than 1 year or less than 1 second.`
        );
      return await interaction.reply({
        embeds: [timeEmbed],
        ephemeral: true,
      });
    }

    // Defining Embeds

    const dmEmbed = new EmbedBuilder()
      .setDescription(
        `🔨 You were banned from **${interaction.guild.name}**.\nReason: ${reason}.`
      )
      .setColor("Red");

    if (time !== `notime`)
      dmEmbed.setDescription(
        `🔨 You were banned from **${
          interaction.guild.name
        }** till <t:${Math.floor(
          Date.now() / 1000 + time / 1000
        )}:D>.\nReason: ${reason}.`
      );

    const sucess = new EmbedBuilder()
      .setDescription(
        `<:check:1082334169197187153> **${banMember.user.tag}** was banned.\nReason: ${reason}.`
      )
      .setColor("Green");

    if (time !== `notime`)
      sucess.setDescription(
        `<:check:1082334169197187153> **${
          banMember.user.tag
        }** was banned till <t:${Math.floor(
          Date.now() / 1000 + time / 1000
        )}:D>.\nReason: ${reason}.`
      );

    const fail = new EmbedBuilder()
      .setDescription(
        `<:cross:1082334173915775046> Unable to ban ${banMember.user.tag}.`
      )
      .setColor("Red");

    const roleIssue = new EmbedBuilder()
      .setDescription(
        `<:cross:1082334173915775046> Unable to ban ${banMember.user.tag} due to role hierarchy.`
      )
      .setColor("Red");

    // Execution Code

    if (!banMember.kickable)
      return await interaction.reply({ embeds: [roleIssue], ephemeral: true });

    if (banMember.id === interaction.user.id) {
      const selfEmbed = new EmbedBuilder()
        .setDescription(
          `<:cross:1082334173915775046> You cannot ban yourself.`
        )
        .setColor("Red");
      return await interaction.reply({
        embeds: [selfEmbed],
        ephemeral: true,
      });
    }

    const notFound = new EmbedBuilder()
      .setDescription(
        `<:cross:1082334173915775046> ${banMember.user.tag} is not present in the server.`
      )
      .setColor("Red");

    if (!banMember)
      return await interaction.reply({ embeds: [notFound], ephemeral: true });


    try {
      await banMember.send({ embeds: [dmEmbed] }).catch(() => {});

      await banMember.ban({ reason: reason });

      await interaction.reply({ embeds: [sucess] });
    } catch (err) {
      await interaction.reply({ embeds: [fail], ephemeral: true });
    }

    if (time === "notime") return;
    else {
      const settime = Date.now() + time;
      await schema.create({
        Guild: interaction.guild.id,
        User: banMember.id,
        Time: settime,
      });
    }
  },
};