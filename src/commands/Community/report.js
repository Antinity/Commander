const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const schema = require(`../../schemas/report`);
const cooldowns = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("report")
    .setDescription("Report a member in this server.")
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("The member to report.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for your report.")
        .setRequired(true)
    ),

  async execute(interaction) {
    const data = await schema.findOne({
      Guild: interaction.guild.id,
    });

    if (!data) {
      const notConfigured = new EmbedBuilder().setDescription(
        `<:cross:1082334173915775046> Report command is not enabled in ${interaction.guild.name}.`
      );
      return await interaction.reply({
        embeds: [notConfigured],
        ephemeral: true,
      });
    }

    let reportChannel = interaction.guild.channels.cache.get(data.Channel);

    const reporter = interaction.user;
    const reporterID = reporter.id;
    const target = interaction.options.getUser(`member`);
    const targetID = target.id;
    const reason = interaction.options.getString(`reason`);

    // Check if the user is on cooldown
    if (cooldowns.has(reporterID)) {
      const lastTime = cooldowns.get(reporterID);
      const cooldownTime = 60 * 60 * 1000; // 1 hour in milliseconds
      const timeLeft = lastTime + cooldownTime - Date.now();

      const cooldownEmbed = new EmbedBuilder()
        .setDescription(
          `Please wait a few moments before reporting a member again.`
        )
        .setColor("Red");

      if (timeLeft > 0) {
        return interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
      }
    }

    cooldowns.set(reporterID, Date.now());

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`Report for ${target.tag}`)
      .addFields({ name: `Reason`, value: reason })
      .setDescription(
        `${target}'s ID: ${targetID}\nReport by ${reporter.tag} • ID: ${reporterID}`
      );

    const embed2 = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`Your report for ${target.tag} has sent.`)
      .setDescription(`Reaosn: ${reason}`);

    await reportChannel.send({
      embeds: [embed],
    });
    interaction.reply({
      embeds: [embed2],
      ephemeral: true,
    });
  },
};
