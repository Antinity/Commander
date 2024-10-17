const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActivityType,
} = require(`discord.js`);
const devID = process.env.DeveloperID.split(',');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("devsetstatus")
    .setDescription("Set the bot client's status presense.")
    .addStringOption((option) =>
      option
        .setName(`status`)
        .setDescription(`The status of the bot.`)
        .setRequired(true)
        .addChoices(
          { name: `Online`, value: `online` },
          { name: `Idle`, value: `idle` },
          { name: `Do Not Disturb`, value: `dnd` },
          { name: `Invisible`, value: `invisible` }
        )
    )
    .addStringOption((option) =>
      option
        .setName(`type`)
        .setDescription(`The type of the status.`)
        .setRequired(true)
        .addChoices(
          { name: `Playing`, value: `${1}` },
          { name: `Listening to`, value: `${3}` },
          { name: `Watching`, value: `${4}` },
          { name: `Competing in`, value: `${6}` }
        )
    )
    .addStringOption((option) =>
      option
        .setName(`text`)
        .setDescription(`The text of the status.`)
        .setRequired(true)
        .setMaxLength(128)
    ),
  async execute(interaction, client) {
    const { options } = interaction;
    const text = options.getString(`text`);
    const type = options.getString(`type`);
    const status = options.getString(`status`);

    const notDev = new EmbedBuilder()
      .setDescription(
        `<:cross:1082334173915775046> This command can be only executed by the developer.`
      )
      .setColor(`Red`);

      if (!devID.includes(interaction.user.id)) {
        return interaction.reply({ embeds: [notDev], ephemeral: true})
    }

    let statusIcon;
    if (status === "online") statusIcon = `\🟢`;
    if (status === "idle") statusIcon = `\🌙`;
    if (status === "dnd") statusIcon = `\⛔`;
    if (status === "invisible") statusIcon = `\⚫`;

    let msg;
    if (type === "1") msg = `Playing ${text}`;
    if (type === "3") msg = `Listening to ${text}`;
    if (type === "4") msg = `Watching ${text}`;
    if (type === "6") msg = `Competeing in ${text}`;


    const embed = new EmbedBuilder()
      .setColor(`Green`)
      .setAuthor({ name: `${client.user.username}`, iconURL: client.user.avatarURL() })
      .setDescription(`\\${statusIcon} ${msg}`)

    try {
      client.user.setActivity({
        name: text,
        type: type - 1,
      });
        client.user.setStatus(status);
      await interaction.reply({ embeds: [embed] });
    } catch (e) {
      console.log(err);
      interaction.editReply({
        embeds: [
          embed
            .setDescription(
              `<:cross:1082334173915775046> An error occured.\n\`\`\`${err}\`\`\``
            )
            .setColor(21873),
        ],
      });
    }
  },
};
