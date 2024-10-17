const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription(`Lock or unlock a channel.`)
    .addSubcommand((subcommand) =>
      subcommand
        .setName(`add`)
        .setDescription(`Lock a channel to disable sending messages.`)
        .addChannelOption((option) =>
          option
            .setName(`channel`)
            .setDescription(`Select the channel you want to lock.`)
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )

    .addSubcommand((subcommand) =>
      subcommand
        .setName(`remove`)
        .setDescription(`Unlock a channel to enable sending messages.`)
        .addChannelOption((option) =>
          option
            .setName(`channel`)
            .setDescription(`Select the channel you want to unlock.`)
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )

    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    let channel = interaction.options.getChannel(`channel`);

    try {
      if (subcommand === `add`) {
        channel.permissionOverwrites.create(interaction.guild.id, {
          SendMessages: false,
        });

        const sucess = new EmbedBuilder()
          .setDescription(
            `<:check:1082334169197187153> ${channel} has been locked.`
          )
          .setColor("Green");

        await interaction.reply({ embeds: [sucess] });
      }

      if (subcommand === `remove`) {
        channel.permissionOverwrites.create(interaction.guild.id, {
          SendMessages: true,
        });

        const sucess = new EmbedBuilder()
          .setDescription(
            `<:check:1082334169197187153> ${channel} has been unlocked.`
          )
          .setColor("Green");

        await interaction.reply({ embeds: [sucess] });
      }
    } catch (error) {
      const errorEmbed = new EmbedBuilder()
        .setDescription(
          `<:error:1082334169197187153> Unable to lock/unlock ${channel}.`
        )
        .setColor("Red");

      await interaction.reply({ embeds: [errorEmbed] });
    }
  },
};
