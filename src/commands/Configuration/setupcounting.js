const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const countingschema = require("../../schemas/counting");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setupcounting")
    .setDescription("Setup or manage counting game for your server.")
    .addSubcommand((command) =>
      command
        .setName("enable")
        .setDescription("Setup the counting system.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Select the counting game channel.")
            .setRequired(true)
        )
        .addBooleanOption((option) =>
            option
                .setName("reset")
                .setDescription("Reset the counting system on wrong count/number.")
                .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command
        .setName("disable")
        .setDescription("Disable the counting system for your server.")
    )
    .setDMPermission(false),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const channel = interaction.options.getChannel("channel");
    const reset = interaction.options.getBoolean("reset");
    const data = await countingschema.findOne({ Guild: interaction.guild.id });

      if (
        !interaction.member.permissions.has(PermissionFlagsBits.ManageGuild) &&
        interaction.user.id !== process.env.DeveloperID.split(',')
      ) {
        const PermissionEmbed = new EmbedBuilder()
        .setColor(`Red`)
        .setDescription(`<:cross:1082334173915775046> You are not allowed to perform this action.`);
        return await interaction.reply({ embeds: [PermissionEmbed], ephemeral: true });
      }
      
    switch (sub) {
      case "enable":
        const alr = new EmbedBuilder()
          .setColor("Green")
          .setDescription(
            `<:cross:1082334173915775046> Counting system is already enabled. If you wish to still change the channel, please disable the counting system first.`
          );
        if (data)
          return await interaction.reply({
            embeds: [alr],
            ephemeral: true,
          });
        else {
          countingschema.create({
            Guild: interaction.guild.id,
            Channel: channel.id,
            Count: 0,
            Reset: reset
          });

          const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(
              `<:check:1082334169197187153> Counting system has been set to ${channel} channel.`
            );

          await interaction.reply({ embeds: [embed] });
        }

        break;

      case "disable":
        const not = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            `<:cross:1082334173915775046> Counting system is not enabled.`
          );
        if (!data)
          return await interaction.reply({
            embeds: [not],
            ephemeral: true,
          });
        else {
          await countingschema.deleteMany();
          data.save();

          const done = new EmbedBuilder()
            .setColor("Green")  
            .setDescription(
                `<:check:1082334169197187153> Counting system has been disabled.`
            );

          await interaction.reply({
            embeds: [done],
          });
        }
    }
  },
};
