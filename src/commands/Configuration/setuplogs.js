const {SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType}= require('discord.js');
const logSchema = require("../../schemas/logs");
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName("setuplogs")
    .setDescription("Set up advanced audit logging.")
    .addSubcommand(command => command.setName('enable').setDescription('Set up and enable the logging system.').addChannelOption(option => option.setName("channel").setDescription("Select the logs channel.").setRequired(false).addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)))
    .addSubcommand(command => command.setName('disable').setDescription('Disable the logging sytem.')),
    async execute(interaction) {
 
    if (
      !interaction.member.permissions.has(PermissionFlagsBits.Administrator) &&
      interaction.user.id !== process.env.DeveloperID.split(',')
    ) {
      const PermissionEmbed = new EmbedBuilder()
        .setColor(`Red`)
        .setDescription(`<:cross:1082334173915775046> You are not allowed to perform this action.`);
      return await interaction.reply({ embeds: [PermissionEmbed], ephemeral: true });
    }
 
        const sub = await interaction.options.getSubcommand();
        const data = await logSchema.findOne({ Guild: interaction.guild.id });
 
        switch (sub) {
          case "enable":
            const alr = new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                `<:cross:1082334173915775046> You have already set up the logging system.`
              );
            if (data)
              return await interaction.reply({
                embeds: [alr],
                ephemeral: true,
              });
            else {
              const logchannel =
                interaction.options.getChannel("channel") ||
                interaction.channel;

              const embed = new EmbedBuilder()
                .setColor("Green")
                .setDescription(
                  `<:check:1082334169197187153> Logging system has been enabled to send logs to ${logchannel}.`
                );

              await interaction.reply({ embeds: [embed] });

              await logSchema.create({
                Guild: interaction.guild.id,
                Channel: logchannel.id,
              });
            }

            break;
          case "disable":
            const notalr = new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                `<:cross:1082334173915775046> You do not have the logging system set up.`
              );

            if (!data)
              return await interaction.reply({
                embeds: [notalr],
                ephemeral: true,
              });
            else {
              const disableembed = new EmbedBuilder()
                .setColor("Green")
                .setDescription(
                  `<:check:1082334169197187153> Logging system has been disabled.`
                );

              await interaction.reply({ embeds: [disableembed] });

              await logSchema.deleteMany({ Guild: interaction.guild.id });
            }
        }          
    }
}