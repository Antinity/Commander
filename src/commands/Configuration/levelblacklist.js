const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const schema = require("../../schemas/levelBlacklist");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("levelblacklist")
    .setDescription(
      "Setup and manage blacklisted level channels for your server."
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName(`add`)
        .setDescription(`Add a new channel to the blacklist.`)
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Specify the channel to blacklist.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(`delete`)
        .setDescription(`Remove a channel from the blacklist.`)
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Specify the channel to remove from blacklist.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("List all blacklisted channels in the server.")
    )
    .setDMPermission(false),
  async execute(interaction) {
    try {
      const subcommand = interaction.options.getSubcommand();

      if (
        !interaction.member.permissions.has(PermissionFlagsBits.ManageGuild) &&
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

      // list

      if (subcommand === "list") {
        const res1 = await schema.find({
          Guild: interaction.guild.id,
        });

        if (!res1.length) {
          const errembed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `<:cross:1082334173915775046> No blacklisted channels found.`
            );

          return await interaction.reply({
            embeds: [errembed],
            ephemeral: true,
          });
        }

        const commandList = res1.map((command) => {
          return (ch = command.Channel);
        });

        const embed = new EmbedBuilder()
          .setTitle(
            `\🤖 Blacklisted level channel in ${interaction.guild.name}`
          )
          .setDescription("<#" + commandList.join(">\n<#") + ">")
          .setColor("Blue");

        await interaction
          .reply({
            embeds: [embed],
          })
          .catch((err) => {
            console.log(err);
          });
      }

      // delete

      if (subcommand === "delete") {
        const channel = interaction.options.getChannel("channel");
        const resDel = await schema.findOneAndDelete({
          Guild: interaction.guild.id,
          Channel: channel.id,
        });

        const sucess = new EmbedBuilder()
          .setDescription(
            `<:check:1082334169197187153> ${channel} has been removed from the blacklist.`
          )
          .setColor("Green");

        if (resDel) {
          return interaction.reply({
            embeds: [sucess],
          });
        } else {
          const notfound = new EmbedBuilder().setDescription(
            `<:cross:1082334173915775046> Channel ${channel} was not found.`
          );

          return interaction.reply({
            embeds: [notfound],
            ephemeral: true,
          });
        }
      }

      if (subcommand === "add") {
        let channel = interaction.options.getChannel("channel");

        // Check if the command already exists in the guild
        const alreadyExists = await schema.findOne({
          Guild: interaction.guild.id,
          Channel: channel.id,
        });

        if (alreadyExists) {
          const alreadyEmbed = new EmbedBuilder()
            .setDescription(
              `<:cross:1082334173915775046> ${channel} is already blacklisted from leveling.`
            )
            .setColor("Red");

          return interaction.reply({
            embeds: [alreadyEmbed],
            ephemeral: true,
          });
        }

        // Create the command
        const newCommand = new schema({
          Guild: interaction.guild.id,
          Channel: channel.id,
        });

        await newCommand.save();

        const sucess = new EmbedBuilder()
          .setDescription(
            `<:check:1082334169197187153> ${channel} has been blacklisted from leveling.`
          )
          .setColor("Green");

        return interaction.reply({
          embeds: [sucess],
        });
      }
    } catch (err) {
      const error = new EmbedBuilder()
        .setDescription(`<:cross:1082334173915775046> Something went wrong.`)
        .setColor("Red");
      console.error(err);
      await interaction.reply({
        embeds: [error],
        ephemeral: true,
      });
    }
  },
};
