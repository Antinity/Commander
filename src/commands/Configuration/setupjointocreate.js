const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require("discord.js");
const Schema = require("../../schemas/jointocreate");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setupjointocreate")
    .setDescription("Set up the join to create voice channel system.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("enable")
        .setDescription("Enable the join to create voice channel system.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription(
              "Select the channel where the join to create voice channel system will be enabled."
            )
            .addChannelTypes(ChannelType.GuildVoice)
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName("category")
            .setDescription("Select the category for the voice channels.")
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("disable")
        .setDescription("Disable the join to create voice channel system.")
    )
    .setDMPermission(false),
  async execute(interaction, client) {
    if (
      !interaction.member.permissions.has(PermissionFlagsBits.ManageGuild) &&
      interaction.user.id !== process.env.DeveloperID.split(',')
    ) {
      const errEmbed = new EmbedBuilder()
        .setColor(`Red`)
        .setDescription(
          `<:cross:1082334173915775046> You are not allowed to perform this action.`
        );
      return await interaction.reply({ embeds: [errEmbed], ephemeral: true });
    }
    const data = await Schema.findOne({ Guild: interaction.guild.id });
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "enable") {
      if (data) {
        await Schema.findOneAndUpdate(
          { Guild: interaction.guild.id },
          {
            Channel: interaction.options.getChannel("channel").id,
            Category: interaction.options.getChannel("category").id,
          }
        );
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `<:check:1082334169197187153> The join to create voice channel system has been updated to <#${
                  interaction.options.getChannel("channel").id
                }>.`
              )
              .setColor("Green"),
          ],
        });
      }

      await Schema.create({
        Guild: interaction.guild.id,
        Channel: interaction.options.getChannel("channel").id,
        Category: interaction.options.getChannel("category").id,
      });
      const sucess = new EmbedBuilder()
        .setDescription(
          `<:check:1082334169197187153> The join to create voice channel system has been enabled in <#${
            interaction.options.getChannel("channel").id
          }>.`
        )
        .setColor("Green");

      await interaction.reply({ embeds: [sucess] });
    }
    if (subcommand === `disable`) {
      if (data) {
        await Schema.findOneAndDelete({ Guild: interaction.guild.id });
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `<:check:1082334169197187153> The join to create voice channel system has been disabled.`
              )
              .setColor("Green"),
          ],
        });
      } else {
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `<:cross:1082334173915775046> The join to create voice channel system is already disabled.`
              )
              .setColor("Red"),
          ],
          ephemeral: true,
        });
      }
    }
  },
};
