let {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
let Schema = require("../../schemas/welcomer");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setupwelcomer")
    .setDescription("Setup welcomer system to greet members.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName(`enable`)
        .setDescription(`Enable welcomer system.`)
        .addChannelOption((option) =>
          option
            .setName(`channel`)
            .setDescription(`The channel welcome messages will be sent to.`)
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName(`message`)
            .setDescription(
              `You can use {member}, {membername}, {membertag}, {server} and {membercount} placeholders.`
            )
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName(`disable`).setDescription(`Disable welcomer system.`)
    )
    .setDMPermission(false),

  async execute(interaction, client) {

      if (
        !interaction.member.permissions.has(PermissionFlagsBits.ManageGuild) &&
        interaction.user.id !== process.env.DeveloperID.split(',')
      ) {
        const PermissionEmbed = new EmbedBuilder()
        .setColor(`Red`)
        .setDescription(`<:cross:1082334173915775046> You are not allowed to perform this action.`);
        return await interaction.reply({ embeds: [PermissionEmbed], ephemeral: true });
      }

    let subcommand = interaction.options.getSubcommand();

    if (subcommand === `enable`) {
      let channel = interaction.options.getChannel(`channel`);
      let message = interaction.options.getString(`message`);

      let alreadyEnabled = await Schema.findOne({
        GuildID: interaction.guild.id,
      });
      if (alreadyEnabled) {
        await Schema.findOneAndUpdate(
          { GuildID: interaction.guild.id },
          { Channel: channel.id, Message: message }
        ).then(async () => {
          const sucess = new EmbedBuilder()
            .setColor("Green")
            .setDescription(
              `<:check:1082334169197187153> Welcomer system has been updated to send welcome messages to ${channel}.\n\`\`\`${message}\`\`\``
            );
          await interaction.reply({ embeds: [sucess] });
        });
      } else {
        let channelID = channel.id;

        let Data = new Schema({
          GuildID: interaction.guild.id,
          Channel: channelID,
          Message: message,
        });

        await Data.save();

        const sucess = new EmbedBuilder()
          .setColor("Green")
          .setDescription(
            `<:check:1082334169197187153> Welcomer system has been enabled to send welcome messages to ${channel}.\n\`\`\`${message}\`\`\``
          );

        await interaction.reply({ embeds: [sucess] });
      }
    }

    if (subcommand === `disable`) {
      try {
        await Schema.findOneAndDelete({ Guild: interaction.guild.id }).then(
          async () => {
            const sucess = new EmbedBuilder()
              .setColor("Green")
              .setDescription(
                `<:check:1082334169197187153> Welcomer system has been disabled.`
              );

            await interaction.reply({ embeds: [sucess] });
          }
        );
      } catch (error) {
        const errorEmbed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            `<:cross:1082334173915775046> The welcomer system is not enabled.`
          );
        interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }
    }
  },
};
