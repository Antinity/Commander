const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const channelID = process.env.FeedBackChannelID;
const cooldowns = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("feedback")
    .setDescription("Provide feedback for the bot.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("bugreport")
        .setDescription("Report a bug.")
        .addStringOption((option) =>
          option
            .setName("bug")
            .setDescription("Describe the bug.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(`suggestion`)
        .setDescription(`Suggest a feature for the bot.`)
        .addStringOption((option) =>
          option
            .setName(`suggestion`)
            .setDescription(`Describe the suggestion.`)
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const user = interaction.user;
    const userID = user.id;

    const subcommand = interaction.options.getSubcommand();

    const channel = interaction.client.channels.cache.get(channelID);

    try {
      if (subcommand === "bugreport") {
        let bug = interaction.options.getString("bug");

        // Check if the user is on cooldown
        if (cooldowns.has(userID)) {
          const cooldownEmbed = new EmbedBuilder()
            .setDescription(
              `Please wait a few hours before reporting a bug again.`
            )
            .setColor("Red");
          const lastTime = cooldowns.get(userID);
          const cooldownTime = 60 * 60 * 1000; // 1 hour in milliseconds
          const timeLeft = lastTime + cooldownTime - Date.now();

          if (timeLeft > 0) {
            return interaction.reply({
              embeds: [cooldownEmbed],
              ephemeral: true,
            });
          }
        }

        const embed = new EmbedBuilder()
          .setColor("Red")
          .setAuthor({
            name: `Bug Report by ${user.tag}`,
            iconURL: user.displayAvatarURL(),
          })
          .setDescription(`${bug}`);
        const embed2 = new EmbedBuilder()
          .setColor("Green")
          .setAuthor({ name: `You have successfully sent a bug report.` })
          .setDescription(`Bug: ${bug}`);

        await channel.send({
          embeds: [embed],
        });
        interaction.reply({
          embeds: [embed2],
          ephemeral: true,
        });

        cooldowns.set(userID, Date.now());
      }

      if (subcommand === "suggestion") {
        let suggestion = interaction.options.getString("suggestion");

        // Check if the user is on cooldown
        if (cooldowns.has(userID)) {
          const cooldownEmbed = new EmbedBuilder()
            .setDescription(`Please wait a few hours before sending a suggestion.`)
            .setColor("Red");
          const lastTime = cooldowns.get(userID);
          const cooldownTime = 60 * 60 * 1000; // 1 hour in milliseconds
          const timeLeft = lastTime + cooldownTime - Date.now();

          if (timeLeft > 0) {
            return interaction.reply({
              embeds: [cooldownEmbed],
              ephemeral: true,
            });
          }
        }

        const embed = new EmbedBuilder()
          .setColor("Blue")
          .setAuthor({
            name: `Suggestion by ${user.tag}`,
            iconURL: user.displayAvatarURL(),
          })
          .setDescription(`${suggestion}`);
        const embed2 = new EmbedBuilder()
          .setColor("Green")
          .setAuthor({
            name: `We have recived your suggestion. Thanks for your time to make us better.`,
          })
          .setDescription(`Suggestion: ${suggestion}`);

        await channel.send({
          embeds: [embed],
        });
        interaction.reply({
          embeds: [embed2],
          ephemeral: true,
        });

        cooldowns.set(userID, Date.now());
      }
    } catch (e) {
      console.log(e);
      const errorEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(`An error has occured.`);
      interaction.reply({
        embeds: [errorEmbed],
        ephemeral: true,
      });
    }
  },
};
