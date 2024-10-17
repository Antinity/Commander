const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
} = require("discord.js");
const { AutoPoster } = require("topgg-autoposter");
const express = require("express");

const app = express();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("topgg")
    .setDescription("Vote for the bot on top.gg and sync the bot with top.gg.")
    .setDMPermission(false),
  async execute(interaction, client) {
    await interaction.deferReply();

    const ap = AutoPoster(process.env.TopGG, client);

    ap.on("posted", async () => {
      const embed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(
          "Thanks for helping Commander by syncing the stats with top.gg!\nIf you would like to vote for the bot, please click the button below."
        );
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Vote")
          .setStyle(ButtonStyle.Link)
          .setURL("https://top.gg/bot/950741813516464188/vote")
      );
      await interaction.editReply({ embeds: [embed], components: [row] });
    });

    ap.on("error", async (error) => {
      const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Vote")
          .setStyle(ButtonStyle.Link)
          .setURL("https://top.gg/bot/950741813516464188/vote")
      );
      const errembed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          `<:cross:1082334173915775046> Error while syncing with top.gg\n\n\`\`\`${error}\`\`\`\n\nIf you would like to vote for the bot, please click the button below.`
        );
      await interaction.editReply({ embeds: [errembed], components: [row1] });
    });
  },
};
