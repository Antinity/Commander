const {SlashCommandBuilder, PermissionsBitField, EmbedBuilder} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fake-tweet")
    .setDMPermission(false)
    .setDescription("Send a fake twitter tweet.")
    .addStringOption(option => option.setName("text").setDescription("Specify the text for your tweet.").setRequired(true).setMaxLength(30)),
    async execute (interaction) {

      let tweet = interaction.options.getString("text");
      let user = interaction.user;
      let avatarUrl = user.avatarURL({ extension: "jpg" }) || 'https://cdn.discordapp.com/attachments/1080219392337522718/1093224716875087892/twitter.png';
      let canvas = `https://some-random-api.ml/canvas/tweet?avatar=${avatarUrl}&displayname=${encodeURIComponent(user.username)}&username=${encodeURIComponent(user.username)}&comment=${encodeURIComponent(tweet)}`;

      const sucess = new EmbedBuilder()
        .setColor("Green")
        .setDescription(`<:check:1082334169197187153> Sucessfully sent a fake tweet.`);

      const msg = new EmbedBuilder()
      .setColor(`Blue`)
      .setImage(canvas)
      .setDescription(`🐦 Fake tweet by **${user.username}**`);

      await interaction.reply({ embeds: [sucess], ephemeral: true});
      await interaction.channel.sendTyping(), await interaction.channel.send({ embeds: [msg] });
    },
};