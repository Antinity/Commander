const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const schema = require("../../schemas/autorole");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setupautorole")
    .setDescription(
      "Give roles to members automatically when they join the server."
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(`enable`)
        .setDescription(`Enable the auto role feature.`)
        .addRoleOption((option) =>
          option
            .setName(`role`)
            .setDescription(`Select the role you want to give to new members.`)
            .setRequired(true)
        ))
        .addSubcommand((subcommand) =>
          subcommand
            .setName(`disable`)
            .setDescription(`Disable the auto role feature.`)
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

    if (subcommand === `enable`) {
      let role = interaction.options.getRole(`role`);

      const alreadyOn = await schema.findOne({
        GuildID: interaction.guild.id,
      });
      if (alreadyOn) {
        const Done1 = new EmbedBuilder()
          .setDescription(
            `<:check:1082334169197187153> Autorole has been updated to ${role.name} role.`
          )
          .setColor("Green");

        await schema.findOneAndUpdate(
          {
            GuildID: interaction.guild.id,
          },
          {
            Role: role.id,
          }
        );
        return interaction.reply({ embeds: [Done1], ephemeral: true });
      } else {
        const sucess = new EmbedBuilder()
          .setDescription(
            `<:check:1082334169197187153> Autorole has been set to ${role.name} role.`
          )
          .setColor("Green");

        const data = new schema({
          GuildID: interaction.guild.id,
          Role: role.id,
        });
        data.save();

        await interaction.reply({ embeds: [sucess] });
      }
      if (subcommand === `disable`) {
        const Done2 = new EmbedBuilder()
          .setDescription(`<:check:1082334169197187153> Autorole has been disabled.`)
          .setColor("Green");

        await schema.findOneAndDelete({
          GuildID: interaction.guild.id,
        });
        return interaction.reply({ embeds: [Done2] });
      }
    }
  },
};
