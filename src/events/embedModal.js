const {
  Events,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  TextInputStyle,
} = require(`discord.js`);

module.exports = {
  once: false,
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (!interaction.isButton()) return;

    const embed = new EmbedBuilder();

    if (interaction.customId === "embedCreatorTitle") {
      const modal = new ModalBuilder()
        .setTitle("Title")
        .setCustomId(`embedCreatorTitleModal`);

      const text = new TextInputBuilder()
        .setLabel("Specify the title of your embed message.")
        .setPlaceholder("Enter the title of the embed.")
        .setMinLength(1)
        .setRequired(true)
        .setMaxLength(256)
        .setStyle(TextInputStyle.Paragraph)
        .setCustomId("embedCreatorTitleModalText");

      const row = new ActionRowBuilder().addComponents(text);

      modal.addComponents(row);

      try {
        await interaction.showModal(modal);
      } catch (error) {
        console.log(error);
        await interaction.reply({
          content: "Something went wrong",
          ephemeral: true,
        });
      }

      const response = await interaction.awaitModalSubmit({ time: 300000 });
      const title = response.fields.getTextInputValue(
        "embedCreatorTitleModalText"
      );

      await response.deferUpdate();

      embed.setTitle(title);

      await interaction.editReply({
        embeds: [embed],
      });

      const updated = new EmbedBuilder()
        .setColor(`Green`)
        .setDescription(
          `<:check:1082334169197187153> Your embed has been updated.`
        );

      await interaction.followUp({
        embeds: [updated],
        ephemeral: true,
      });
    }
  },
};
