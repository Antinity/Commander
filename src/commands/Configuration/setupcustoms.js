const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const CustomCommand = require("../../schemas/customcommand.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setupcustoms")
    .setDescription("Setup and manage custom commands for your server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName(`add`)
        .setDescription(`Add a new custom command.`)
        .addStringOption((option) =>
          option
            .setName("keyword")
            .setDescription("Specify the keyword for the command.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reply")
            .setDescription("Specify the reply for the command.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(`delete`)
        .setDescription(`Delete a custom command.`)
        .addStringOption((option) =>
          option
            .setName(`keyword`)
            .setDescription(`Specify the keyword of custom command.`)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("List all custom commands in the server.")
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
          .setDescription(`<:cross:1082334173915775046> You are not allowed to perform this action.`);
          return await interaction.reply({ embeds: [PermissionEmbed], ephemeral: true });
        }

      // list

      if (subcommand === "list") {
        const res1 = await CustomCommand.find({
          GuildID: interaction.guild.id,
        });
        const commandList = res1.map((command) => {
          const name = command.Keyword || "Unknown Keyword";
          const value = command.Reply || "No reply specified!";
          return {
            name,
            value,
          };
        });

        const embed = new EmbedBuilder()
          .setTitle(`\🤖 Custom Commands in ${interaction.guild.name}`)
          .addFields(commandList)
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
        const keywordToDelete = interaction.options.getString("keyword");
        const resDel = await CustomCommand.findOneAndDelete({
          GuildID: interaction.guild.id,
          Keyword: keywordToDelete,
        });

        const sucess = new EmbedBuilder()
          .setDescription(
            `<:check:1082334169197187153> Custom command deleted successfully.\nKeyword: "${keywordToDelete}".`
          )
          .setColor("Green");

        if (resDel) {
          return interaction.reply({
            embeds: [sucess],
          });
        } else {
          const notfound = new EmbedBuilder().setDescription(
            `<:cross:1082334173915775046> Custom command with keyword "${keywordToDelete}" was not found.`
          );

          return interaction.reply({
            embeds: [notfound],
            ephemeral: true,
          });
        }
      }

      if (subcommand === "add") {
        let keyword = interaction.options.getString("keyword");
        let reply = interaction.options.getString("reply");

        // Check if the command already exists in the guild
        const alreadyExists = await CustomCommand.findOne({
          GuildID: interaction.guild.id,
          Keyword: keyword,
        });

        if (alreadyExists) {
          const alreadyEmbed = new EmbedBuilder()
            .setDescription(
              `<:cross:1082334173915775046> Custom command with "${keyword}" already exists.`
            )
            .setColor("Red");

          return interaction.reply({
            embeds: [alreadyEmbed],
            ephemeral: true,
          });
        }

        // Create the command
        const newCommand = new CustomCommand({
          GuildID: interaction.guild.id,
          Keyword: keyword,
          Reply: reply,
        });

        await newCommand.save();

        const sucess = new EmbedBuilder()
          .setDescription(
            `<:check:1082334169197187153> Custom command created.\nKeyword: "${keyword}".\nReply "${reply}".`
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
