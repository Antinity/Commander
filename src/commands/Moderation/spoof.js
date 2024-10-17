const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("spoof")
    .setDMPermission(false)
    .setDescription("Spoofs a specified message as specified member.")
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("Select the member to spoof.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Specify the spoofed message.")
        .setRequired(true)
    )
    .setDMPermission(false),

  async execute(interaction, client) {
    const { options } = interaction;


    if (
      !interaction.member.permissions.has(PermissionFlagsBits.ManageMessages) &&
      interaction.user.id !== process.env.DeveloperID.split(',')
    ) {
      const PermissionEmbed = new EmbedBuilder()
        .setColor(`Red`)
        .setDescription(`<:cross:1082334173915775046> You are not allowed to perform this action.`);
      return await interaction.reply({ embeds: [PermissionEmbed], ephemeral: true });
    }

    const member = options.getUser("member");
    const message = options.getString("message");
    interaction.channel
      .createWebhook({
        name: member.membername,
        avatar: member.displayAvatarURL({ dynamic: true }),
      })
      .then((webhook) => {
        webhook.send({name: member.name, avatar: member.displayAvatarURL({ dynamic: true }), content: message});
        setTimeout(() => {
          webhook.delete();
        }, 3000);
      });
      const sucess = new EmbedBuilder()
        .setColor("Green")
        .setDescription(`<:check:1082334169197187153> Spoofed ${member}.`);
    interaction.reply({
      embeds: [sucess],
      ephemeral: true,
    });
  },
};