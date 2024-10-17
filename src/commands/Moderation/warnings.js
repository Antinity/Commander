const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const warnSchema = require(`../../schemas/warnSchema`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warnings")
    .setDescription("List all warnings of a member.")
    .addUserOption((option) =>
      option.setName(`member`).setDescription("The member to list warns.")
    ),

  async execute(interaction) {
    const member = interaction.options.getUser(`member`) || interaction.user;
    const memberTag = member.tag || member.user.tag;

    const res1 = await warnSchema.find({
      GuildID: interaction.guild.id,
      UserID: member.id,
      Reason: { $exists: true },
    });

    if (!res1 || res1.length === 0) {
      const noWarnsEmbed = new EmbedBuilder()
        .setDescription(
          `<:cross:1082334173915775046> ${memberTag} hasn't received any warnings yet.`
        )
        .setColor("Red");
      return await interaction.reply({
        embeds: [noWarnsEmbed],
        ephemeral: true,
      });
    }

    const warns = res1.map((warn) => ({
      name: `Reason: ${warn.Reason.join(", ")}`,
      value: `Date: ${warn.Date}\nModerator: *${warn.Moderator}*`,
    }));

    const showWarnsEmbed = new EmbedBuilder()
      .setAuthor({
        name: `${member.tag}'s warnings in ${interaction.guild.name}`,
        iconURL: member.displayAvatarURL({ dynamic: true }),
      })
      .addFields(warns)
      .setColor("Green");

    await interaction.reply({ embeds: [showWarnsEmbed] });
  },
};
