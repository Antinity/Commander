const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("role")
    .setDescription("Manage roles for a member.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add a role to a member.")
        .addUserOption((option) =>
          option
            .setName("member")
            .setDescription("Select a member to assign the role.")
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("Select the role to assign to the member.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("all")
        .setDescription("Add a role to all member in the server.")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("Select the role to assign to the member.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(`remove`)
        .setDescription(`Remove a role from a member.`)
        .addUserOption((option) =>
          option
            .setName("member")
            .setDescription("Select a member to remove the role from.")
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("Select the role to remove from the member.")
            .setRequired(true)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    let member = interaction.options.getMember("member");
    let role = interaction.options.getRole("role");

    if (subcommand === "add") {
      const sucess = new EmbedBuilder()
        .setDescription(
          `<:check:1082334169197187153> ${member.tag} has been assigned with ${role} role.`
        )
        .setColor(`Green`);

      const fail = new EmbedBuilder()
        .setDescription(
          `<:cross:1082334173915775046> Unable to assign ${role} role to ${member.tag}.`
        )
        .setColor(`Red`);

      const alr = new EmbedBuilder()
        .setDescription(
          `<:cross:1082334173915775046> ${member.tag} already has ${role} role.`
        )
        .setColor(`Red`);

      if (interaction.member.roles.cache.has(role.id)) {
        return interaction.reply({ embeds: [alr], ephemeral: true });
      } else {
        member.roles
          .add(role)
          .then(() => {
            interaction.reply({ embeds: [sucess] });
          })
          .catch(() => {
            interaction.reply({ embeds: [fail], ephemeral: true });
          });
      }
    }

    if (subcommand === "all") {
      const done = new EmbedBuilder()
        .setColor("Green")
        .setDescription(
          `<:check:1082334169197187153> ${role} role has been assigned to all members.\nPlease note that it might take a while for the roles to be assigned.`
        );

        const fail = new EmbedBuilder()
          .setColor("Red")
          .setDescription(`<:cross:1082334173915775046> Unable to assign ${role} role to all members.`);

      try {
        await interaction.guild.members.cache.forEach((member) =>
          member.roles.add(role)
        );

        await interaction.reply({ embeds: [done] });
      } catch (error) {
        interaction.reply({ embeds: [fail], ephemeral: true });
      }
    }

    if (subcommand === "remove") {
      const sucess = new EmbedBuilder()
        .setDescription(
          `<:check:1082334169197187153> ${role} role has been removed from ${member.tag}.`
        )
        .setColor(`Green`);

      const fail = new EmbedBuilder()
        .setDescription(
          `<:cross:1082334173915775046> Unable to remove ${role} role from ${member.tag}.`
        )
        .setColor(`Red`);

      const alr = new EmbedBuilder()
        .setDescription(
          `<:cross:1082334173915775046> ${member.tag} doesn't have ${role} role.`
        )
        .setColor(`Red`);

      if (interaction.member.roles.cache.has(role.id)) {
        return interaction.reply({ embeds: [alr], ephemeral: true });
      }

      member.roles
        .remove(role)
        .then(() => {
          interaction.reply({ embeds: [sucess] });
        })
        .catch(() => {
          interaction.reply({ embeds: [fail], ephemeral: true });
        });
    }
  },
};
