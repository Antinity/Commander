const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription(`Unban a member or everyone from server.`)
    .addSubcommand((subcommand) =>
      subcommand
        .setName(`member`)
        .setDescription(`Unban a member from server.`)
        .addUserOption((option) =>
          option
            .setName(`member`)
            .setDescription(`Select the member to unban.`)
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName(`reason`)
            .setDescription(`Specify the reason for the unban.`)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(`everyone`)
        .setDescription(`Unban everyone from server (mass unban).`)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === `member`) {
      const userID = interaction.options.getUser(`member`);

      let reason = interaction.options.getString(`reason`) || "Unknown reason";

      const selfBan = new EmbedBuilder()
        .setDescription(
          `<:cross:1082334173915775046> You can't use the unban command on yourself.`
        )
        .setColor("Red");

      if (interaction.member.id === userID)
        return await interaction.reply({ embeds: [selfBan], ephemeral: true });

      const dmMsg = new EmbedBuilder()
        .setDescription(
          `<:alert:1082334164189184051> You were unbanned from **${interaction.guild.name}**.\nReason: ${reason}`
        )
        .setColor("Red");

      const sucess = new EmbedBuilder()
        .setDescription(
          `<:check:1082334169197187153> **${userID.username}#${userID.discriminator}** was unbanned.\nReason: ${reason}.`
        )
        .setColor("Green");

      const fail = new EmbedBuilder()
        .setDescription(
          `<:cross:1082334173915775046> Unable to unban **${userID.username}#${userID.discriminator}**.`
        )
        .setColor("Red");

      await interaction.guild.bans
        .fetch()
        .then(async (bans) => {
          await interaction.guild.bans.remove(userID, reason).catch((err) => {
            return;
          });
        })
        .then(await interaction.reply({ embeds: [sucess] }))
        .catch((err) => {
          return interaction.reply({ embeds: [fail] });
        });
      await userID.send({ embeds: [dmMsg] }).catch((err) => {
        return;
      });
    }

    if (subcommand === `everyone`) {
      await interaction.deferReply();

      try {
        const sucess = new EmbedBuilder()
          .setDescription(
            `<:check:1082334169197187153> All bans have been removed from **${interaction.guild.name}**.`
          )
          .setColor("Green");

        const bannedMembers = await interaction.guild.bans.fetch();

        await Promise.all(
          bannedMembers.map((member) => {
            return interaction.guild.members.unban(member.user.id);
          })
        );

        return interaction.editReply({
          embeds: [sucess],
        });
      } catch (error) {
        const fail = new EmbedBuilder()
          .setDescription(`<:cross:1082334173915775046> Unable to mass unban.`)
          .setColor("Red");
        return interaction.editReply({
          embeds: [fail],
        });
      }
    }
  },
};
