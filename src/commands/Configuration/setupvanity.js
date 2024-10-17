const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require(`discord.js`);
const vanitySchema = require(`../../schemas/vanitySchema`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setupvanity")
    .setDescription("Setup status vanity link rewards.")
    .addStringOption((option) =>
      option
        .setName(`text`)
        .setDescription(`Specify your vanity link text.`)
        .setRequired(true)
        .setMaxLength(32)
    )
    .addRoleOption((option) =>
      option
        .setName(`role`)
        .setDescription(
          `Select the role you want to give to the user who uses the vanity link.`
        )
        .setRequired(true)
    ),
  async execute(interaction) {

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
      await vanitySchema.findOneAndDelete({
        GuildID: interaction.guild.id,
      });

      const embed = new EmbedBuilder()
        .setColor(`Green`)
        .setDescription(
          `<:check:1082334169197187153> Sucessfully disabled the vanity link.`
        );

      return interaction.reply({ embeds: [embed] });
    }

    if (subcommand === `enable`) {
      const text = interaction.options.getString(`text`);
      const role = interaction.options.getRole(`role`);

      const alreadyExists = await vanitySchema.findOne({
        GuildID: interaction.guild.id,
      });

      if (alreadyExists) {
        const alr = new EmbedBuilder()
          .setColor(`Red`)
          .setDescription(
            `<:cross:1082334173915775046> You already have set-up your vanity link. If you want to change it, please disable the command first.`
          );
        return interaction.reply({
          embeds: [alr],
          ephemeral: true,
        });
      }

      const roleID = role.id;

      const newVanity = new vanitySchema({
        GuildID: interaction.guild.id,
        Role: roleID,
        Text: text.toLowerCase(),
      });

      const embed = new EmbedBuilder()
        .setColor(`Green`)
        .setDescription(
          `<:check:1082334169197187153> Vanity rewards has been set with text "${text}" rewarding ${role} role.`
        );

      await newVanity.save();
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
