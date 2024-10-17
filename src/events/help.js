const { Events, EmbedBuilder } = require(`discord.js`);
const fs = require("fs");

module.exports = {
  once: false,
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (interaction.isStringSelectMenu) {
      if (interaction.customId === "helpMenu") {
        interaction.deferUpdate();

        const selection = interaction.values[0];
        const commands = fs
          .readdirSync(`./src/commands/${selection}`) // This will be your command folder path from index.
          .filter((file) => file.endsWith(".js"))
          .map((file) => {
            const command = require(`../commands/${selection}/${file}`);
            return command;
          });

        const commandEmbedFields = await Promise.all(
          commands.map(async (cmd) => {
            const getCommandID = (await client.application.commands.fetch())
              .filter((c) => c.name === cmd.data.name)
              .map((c) => c.id)[0];
            return {
              name: `> </${cmd.data.name}:${getCommandID}>`,
              value: `> ${cmd.data.description}`,
            };
          })
        );

        const embed = new EmbedBuilder()
          .setColor(0x2b2d31)
          .setAuthor({ name: `🧩 ${client.user.username} Help Center` })
          .setTitle(`Command information for ${selection} category.`)
          .setDescription(
            `${commandEmbedFields
              .map((field) => `${field.name}\n${field.value}`)
              .join("\n\n")}`
          );

        await interaction.editReply({
          embeds: [embed],
        });
      }
    }
  },
};
