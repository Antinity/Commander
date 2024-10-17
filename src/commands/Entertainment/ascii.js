const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const ascii = require("ascii-art");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ascii")
    .setDescription("Create and generate Ascii Art")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("Specify your ascii text.")
        .setRequired(true)
    ),

  async execute(interaction) {
    
    const text = interaction.options.getString("text");

    const filter = require("../../utils/filter.json");

    for (var i = 0; i < filter.words.length; i++) {
      const filtered = await text.toLowerCase();
      if (filtered.includes(filter.words[i])) {
        const blacklisted = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            `<:cross:1082334173915775046> Your text contains a blacklisted word!`
          );

        interaction.reply({ embeds: [blacklisted], ephemeral: true });
      }
    }

    ascii.font(text, "Doom", (err, rendered) => {
      if (err) {
        console.error(err);
        const errorembed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          `<:cross:1082334173915775046> An error occurred while generating the ASCII art.`
        );
        return interaction.reply({ embeds: [errorembed], ephemeral: true });
      }
      interaction.reply(`\`\`\`${rendered}\`\`\``);
    });
  },
};
