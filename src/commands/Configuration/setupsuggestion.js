const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require(`discord.js`);
const suggestionSchema = require(`../../schemas/suggestion`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setupsuggestion")
    .setDescription("Setup or remove suggestion channel for your server")
    .addSubcommand((subcommand) =>
      subcommand
        .setName(`setup`)
        .setDescription(`Setup suggestion channel`)
        .addChannelOption((option) =>
          option
            .setName(`channel`)
            .setDescription(`Channel to set as suggestion channel`)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName(`remove`).setDescription(`Remove suggestion channel`)
    ),
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

    if (subcommand === `setup`) {

        const already = await suggestionSchema.findOne({
            Guild: interaction.guild.id,
            });

        if (already) {
            const update = await suggestionSchema.findOneAndUpdate({
                Guild: interaction.guild.id,
                }, {
                Channel: channel.id,
                });

                const embed = new EmbedBuilder()
                .setDescription(
                  `<:check:1082334169197187153> Suggestion channel has been updated to ${channel}.`
                )
                .setColor(`Green`);
        
              await interaction.reply({ embeds: [embed] });
                
        }

      const channel = interaction.options.getChannel("channel");

      const suggestionchema = new suggestionSchema({
        Guild: interaction.guild.id,
        Channel: channel.id,
      });

      await suggestionchema.save().catch((err) => {
        return;
      });

      const embed = new EmbedBuilder()
        .setDescription(
          `<:check:1082334169197187153> Suggestion channel has been setup to ${channel}.`
        )
        .setColor(`Green`);

      await interaction.reply({ embeds: [embed] });
    }

    if (subcommand === `remove`) {

        const already = await suggestionSchema.findOne({
            Guild: interaction.guild.id,
            });

        if (!already) {
            const embed = new EmbedBuilder()
            .setDescription(
                `<:cross:1082334173915775046> Suggestion command is already disabled.`
            )
            .setColor(`Red`);

            return await interaction.reply({ embeds: [embed], ephemeral: true });

        }

      await suggestionSchema.findOneAndDelete({
        Guild: interaction.guild.id,
      });

      const embed = new EmbedBuilder()
        .setDescription(
          `<:check:1082334169197187153> Suggestion command has been disabled.`
        )
        .setColor(`Green`);

      await interaction.reply({ embeds: [embed] });
    }
  },
};
