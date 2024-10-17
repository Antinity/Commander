const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const schema = require(`../../schemas/report`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setupreport")
    .setDescription("Setup report log channel.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName(`enable`)
        .setDescription(`Enable the report system.`)
        .addChannelOption((option) =>
          option
            .setName(`channel`)
            .setDescription(`The channel to send report logs.`)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName(`disable`).setDescription(`Disable the report system.`)
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

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === `disable`) {
      await schema.findOneAndDelete({
        GuildID: interaction.guild.id,
      });
    }

    if (subcommand === `enable`) {
      let channel = interaction.options.getChannel(`channel`);

      const sucess = new EmbedBuilder()
        .setDescription(`<:check:1082334169197187153> Sucessfully set the report log channel to ${channel}.`)
        .setColor("Green");

      const alreadyExists = await schema.findOne({
        GuildID: interaction.guild.id,
        });

        if (alreadyExists) {
            const alr = new EmbedBuilder()
            .setColor(`Red`)
            .setDescription(`<:cross:1082334173915775046> You already have set-up your report log channel. If you want to change it, please disable the command first.`)
            return interaction.reply({ embeds: [alr] });
        }

        await new schema({
            Guild: interaction.guild.id,
            Channel: channel.id,
        }).save();

      await interaction.reply({ embeds: [sucess] });
    }
  },
};
