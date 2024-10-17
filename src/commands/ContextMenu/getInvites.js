const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("Find Invites")
        .setType(ApplicationCommandType.User)
        .setDMPermission(false),
    async execute(interaction) {
        const { targetUser } = interaction;

        const user = targetUser;

        let invites = await interaction.guild.invites.fetch();
        let userInv = invites.filter(u => u.inviter && u.inviter.id === user.id);

        let i = 0;
        userInv.forEach(inv => i += inv.uses);

        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setDescription(`**${user.tag}** has **${i}** invites in **${interaction.guild.name}**.`)
        await interaction.reply({ embeds: [embed] }).catch(err => {
            console.log(err)
        });
    }
}