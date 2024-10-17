let {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
let Schema = require("../../schemas/farewell");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setupfarewell")
    .setDescription("Setup message system to goodbye members.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName(`enable`)
        .setDescription(`Enable goodbye system.`)
        .addChannelOption((option) =>
          option
            .setName(`channel`)
            .setDescription(`Select the channel goodbye channel.`)
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
      subcommand.setName(`disable`).setDescription(`Disable goodbye system.`)
    )
    .setDMPermission(false),

  async execute(interaction) {
    let subcommand = interaction.options.getSubcommand();

      if (
        !interaction.member.permissions.has(PermissionFlagsBits.ManageGuild) &&
        interaction.user.id !== process.env.DeveloperID.split(',')
      ) {
        const PermissionEmbed = new EmbedBuilder()
        .setColor(`Red`)
        .setDescription(`<:cross:1082334173915775046> You are not allowed to perform this action.`);
        return await interaction.reply({ embeds: [PermissionEmbed], ephemeral: true });
      }

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
              `<:check:1082334169197187153> Farewell system has been updated to send goodbye messages to ${channel}.\n\`\`\`${message}\`\`\``
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
            `<:check:1082334169197187153> Farewell system has been enabled to send goodbye messages to ${channel}.\n\`\`\`${message}\`\`\``
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
                `<:check:1082334169197187153> Farewell system has been disabled.`
              );

            await interaction.reply({ embeds: [sucess] });
          }
        );
      } catch (error) {
        const errorEmbed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            `<:cross:1082334173915775046> The farewell system is not enabled.`
          );
        interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }
    }
  },
};
