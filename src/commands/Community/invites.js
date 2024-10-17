const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("invites")
        .setDescription(`Find your or someone else's invites in this server.`)
        .addUserOption((option) => option
        .setName(`member`)
        .setDescription(`The member to find the invites of.`))
        .setDMPermission(false),
    async execute(interaction) {

        const member = interaction.options.getUser(`member`) || interaction.user;

        let invites = await interaction.guild.invites.fetch();
        let userInv = invites.filter(u => u.inviter && u.inviter.id === member.id);

        let i = 0;
        userInv.forEach(inv => i += inv.uses);

        const embed = new EmbedBuilder()
            .setColor("0x2f3136")
            .setDescription(`**${member.tag}** has **${i}** invites in **${interaction.guild.name}**.`)
        await interaction.reply({ embeds: [embed], ephemeral: true }).catch(err => {
            console.log(err)
        });
    }
}