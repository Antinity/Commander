const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const schema = require(`../../schemas/level`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setuplevels")
    .setDescription("Setup, modify or toggle the level system for your server.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("toggle")
        .setDescription("Enable or disable the level system for your server.")
        .addBooleanOption((option) =>
          option
            .setName("enabled")
            .setDescription("Enable or disable the level system for your server.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("channel")
        .setDescription("Set the channel for the level up messages.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Set the channel for the level up messages.")
            .setRequired(true)
        ))
    .addSubcommand((subcommand) =>
      subcommand
        .setName("reset")
        .setDescription("Reset the XP of a member or everyone (Leave blank for everyone).")
        .addUserOption(option =>
            option
                .setName("member")
                .setDescription("The member you want to reset the XP of.")
                .setRequired(false)
    )),
  async execute(interaction) {
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

    if (subcommand === "toggle") {
        const toggle = interaction.options.getBoolean("toggle");
        const data = await schema.findOne({
            Guild: interaction.guild.id,
        });
        if (data) {
            await schema.findOneAndUpdate({
                Guild: interaction.guild.id,
            }, {
                Toggle: toggle,
            });
            }

            if (toggle === true) {
                return interaction.reply({
                    content: `The level system has been enabled for this server.`,
                    ephemeral: true,
                });
            } else {
                return interaction.reply({
                    content: `The level system has been disabled for this server.`,
                    ephemeral: true,
                });
            }

        }

    if (subcommand === `reset`) {
        const { guildId } = interaction;
        const target = interaction.options.getUser(`member`);

        const data = await schema.findOne({
            Guild: interaction.guild.id,
        });

        if (!target) {
            await schema.deleteMany({ Guild: guildId });
            const success = new EmbedBuilder()
                .setDescription(`<:check:1082334169197187153> Everyone's XP has been reset in this server.`)
                .setColor('Green');
            await interaction.reply({ embeds: [success] });
        } else {
            await schema.deleteMany({ Guild: guildId, User: target.id });
            const success = new EmbedBuilder()
                .setDescription(`<:check:1082334169197187153> ${target.tag}'s XP has been reset.`)
                .setColor('Green');
            await interaction.reply({ embeds: [success] });
        }
    }
    
    if (subcommand === "channel") {
        const channel = interaction.options.getChannel("channel");
        const data = await schema.findOne({
            Guild: interaction.guild.id,
        });
        if (data.Channel === "Unknown") {
            
            await schema.findOneAndUpdate({
                Guild: interaction.guild.id,
            }, {
                Channel: channel.id,
            });
            const success = new EmbedBuilder()
                .setDescription(`<:check:1082334169197187153> The level up channel has been set to ${channel}.`)
                .setColor('Green');

            return interaction.reply({
                embeds: [success],
            });
        }

  }
 
}
};
