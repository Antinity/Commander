const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const schema = require("../../schemas/mcCounter");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setupmccounter")
    .setDescription("Setup the Minecraft Server Status Counter.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("enable")
        .setDescription("Setup the Minecraft Server Status Counter.")
        .addStringOption((option) =>
          option
            .setName("ip")
            .setDescription("The IP of the Minecraft Server.")
            .setRequired(true)
        )
        .addBooleanOption((option) =>
          option
            .setName("bedrock")
            .setDescription("Is the server a bedrock server?")
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription(
              "Select the channel where the counter will be displayed."
            )
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The name of the Minecraft Server.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("disable")
        .setDescription("Disable the Minecraft Server Status Counter.")
    )
    .setDMPermission(false),
  async execute(interaction, client) {
    const sub = interaction.options.getSubcommand();

    if (sub === "enable") {
      const ip = interaction.options.getString(`ip`);
      const bedrock = interaction.options.getBoolean(`bedrock`);
      const channel = interaction.options.getChannel(`channel`);
      const name = interaction.options.getString(`name`);

      const url = `https://api.mcsrvstat.us/2/${ip}`;
      if (bedrock === true) url = `https://api.mcsrvstat.us/bedrock/2/${ip}`;

      const offline = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          `<:cross:1082334173915775046> The server must be online to setup the counter.`
        );

      try {
        var data = await fetch(url).then((res) => res.json());
        var serverip = data.hostname;
        var onlineplayers = data.players.online;
      } catch (error) {
        interaction.reply({ embeds: [offline], ephemeral: true });
        return;
      }
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("mcStatus")
          .setEmoji("🔃")
          .setLabel(`Refresh`)
          .setStyle(ButtonStyle.Success)
      );

      const done = new EmbedBuilder()
        .setColor("Green")
        .setDescription(
          `<:check:1082334169197187153> The server status counter has been setup in ${channel}.`
        );

      const already = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          `<:cross:1082334173915775046> The server status counter is already setup in ${channel}.`
        );

      const sch = await schema.findOne({
        Guild: interaction.guild.id,
      });

      if (sch) {
        return interaction.reply({ embeds: [already], ephemeral: true });
      }

      const newData = new schema({
        Guild: interaction.guild.id,
        Channel: channel.id,
        IP: ip,
        Bedrock: bedrock,
        Title: name,
      });

      await newData.save();

      const currentTimeSeconds = Math.floor(Date.now() / 1000);

      const main = new EmbedBuilder()
        .setColor("Blue")
        .setTitle(name)
        .addFields(
          {
            name: "Status",
            value: "```🟢 Online```",
            inline: true,
          },
          {
            name: "Players",
            value: "```" + onlineplayers.toString() + "```",
            inline: true,
          },
          {
            name: "Last updated",
            value: `<t:${currentTimeSeconds}:R>`,
          }
        );

      await interaction.reply({ embeds: [done], ephemeral: true });
      channel.send({ embeds: [main], components: [row] });
    }
    if (sub === "disable") {
      const res = await schema.findOne({
        Guild: interaction.guild.id,
      });

      const not = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          `<:cross:1082334173915775046> The server status counter is not setup.`
        );

      const done = new EmbedBuilder()
        .setColor("Green")
        .setDescription(
          `<:check:1082334169197187153> The server status counter has been disabled.`
        );

      if (!res) {
        await interaction.reply({ embeds: [not], ephemeral: true });
      }

      await schema.findOneAndDelete({
        Guild: interaction.guild.id,
      });

      await interaction.reply({ embeds: [done], ephemeral: true });
    }
  },
};
