const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription(`Delete multiple messages at once.`)
    .addIntegerOption(option => option.setName(`amount`).setDescription(`Specify the amount of messages you want to delete.`).setMinValue(1).setMaxValue(100).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {

        let number = interaction.options.getInteger(`amount`);

        const sucess = new EmbedBuilder()
        .setDescription(`<:check:1082334169197187153> ${number} messages have been deleted.`)
        .setColor('Green')

        const tooOld = new EmbedBuilder()
        .setDescription(`<:cross:1082334173915775046> Unable to delete messages older than 14 days.`)
        .setColor('Red')

        await interaction.channel.bulkDelete(number).then(async () => {
         await interaction.reply({ embeds: [sucess], ephemeral: true })
        })
        .catch(() => {
            interaction.reply({ embeds: [tooOld], ephemeral: true })
        }
        )
    }

}