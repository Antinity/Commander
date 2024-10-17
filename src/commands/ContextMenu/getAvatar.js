const {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    EmbedBuilder,
  } = require("discord.js");
  
  module.exports = {
    data: new ContextMenuCommandBuilder()
      .setName("Find Avatar")
      .setType(ApplicationCommandType.User)
      .setDMPermission(false),
    async execute(interaction, client) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blue")
            .setImage(interaction.targetUser.displayAvatarURL())
            .setTitle(`${interaction.targetUser.username}'s Avatar`)
        ]
      }).catch(err => {
        console.log(err)
    });
    },
  };
  