const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("Find ID")
        .setType(ApplicationCommandType.User)
        .setDMPermission(false),
    async execute(interaction) {
        const { targetId } = interaction;

        const embed = new EmbedBuilder();

        await interaction.reply({
            embeds: [
                embed
                    .setDescription(`${interaction.targetUser.username}'s ID is **${targetId}**.`)
                    .setColor("Blue")
            ]
        }).catch(err => {
            console.log(err)
        })
    }
}