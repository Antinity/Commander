const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Create highly customizable embeds messages.")
    .addStringOption((option) =>
      option
        .setName("colour")
        .setDescription("The colour of the embed.")
        .addChoices(
          { name: "Red", value: "Red" },
          { name: "Blue", value: "Blue" },
          { name: "Green", value: "Green" },
          { name: "Yellow", value: "Yellow" },
          { name: "Purple", value: "Purple" },
          { name: "Gold", value: "Gold" },
          { name: "Orange", value: "Orange" },
          { name: "Magenta", value: "Magenta" },
          { name: "Dark Red", value: "Red" },
          { name: "Dark Blue", value: "DarkBlue" },
          { name: "Dark Gray", value: "DarkGray" },
          { name: "Dark Green", value: "DarkGreen" },
          { name: "Dark Purple", value: "DarkPurple" },
          { name: "Light Gray", value: "LightGrey" },
          { name: "Blurple", value: "Blurple" },
          { name: "Grayple", value: "Greyple" },
          { name: "Dark But Not Black", value: "DarkButNotBlack" },
          { name: "Not Quite Black", value: "NotQuiteBlack" }
        )
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("timestamp")
        .setDescription("Add a timestamp to the embed.")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Select the channel you want to send the embed to.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("title").setDescription("The title of the embed.")
    )
    .setDMPermission(false),
  async execute(interaction, client) {
    if (
      !interaction.member.permissions.has(PermissionFlagsBits.ManageGuild) &&
      interaction.user.id !== process.env.DeveloperID.split(',')
    ) {
      const PermissionEmbed = new EmbedBuilder()
        .setColor(`Red`)
        .setDescription(
          `<:cross:1082334173915775046> You are not allowed to perform this action.`
        );
      return await interaction.reply({
        embeds: [PermissionEmbed],
        ephemeral: true,
      });
    }

    const title = interaction.options.getString("title");
    const colour = interaction.options.getString("colour");
    const timestamp = interaction.options.getBoolean("timestamp");
    const channel = interaction.options.getChannel("channel");

    const embed = new EmbedBuilder().setColor(colour)

    if (title) embed.setTitle(title);
    if (timestamp) embed.setTimestamp();

    const customizeRow1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("embedCreatorTitle")
        .setLabel("Title")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("📝"),
      new ButtonBuilder()
        .setCustomId("embedCreatorDescription")
        .setLabel("Description")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("🌀"),
      new ButtonBuilder()
        .setCustomId("embedCreatorFooter")
        .setLabel("Footer")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("👣"),
      new ButtonBuilder()
        .setCustomId("embedCreatorThumbnail")
        .setLabel("Thumbnail")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("🎨"),
      new ButtonBuilder()
        .setCustomId("embedCreatorImage")
        .setLabel("Image")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("🖼️"),
    );

    const customizeRow2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setCustomId("author")
        .setLabel("Author")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("👤"),
      new ButtonBuilder()
        .setCustomId("field")
        .setLabel("Field")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("🏏"),
        new ButtonBuilder()
        .setCustomId("send")
        .setLabel("Send")
        .setStyle(ButtonStyle.Success)
        .setEmoji("➡️"),

    )

    await interaction.reply({
      content: `Use the buttons below to customize your embed message.\nAdvanced embed creator by [Antinity](https://youtube.com/@antinityfx).`, // You can remove the credits, but it would be appreciated if you didn't.
      embeds: [embed.setDescription(`The preview of your embed will be shown here.`)],
      components: [customizeRow1, customizeRow2],
    });

  },
};
