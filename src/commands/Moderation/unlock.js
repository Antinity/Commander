const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField, ChannelType, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription(`Unlock a locked channel.`)
    .addChannelOption(option => option.setName(`channel`).setDescription(`The channel to unlock.`).addChannelTypes(ChannelType.GuildText).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {

        const noPerms = new EmbedBuilder()
        .setAuthor({name: `Error!`, iconURL: `https://cdn0.iconfinder.com/data/icons/shift-interfaces/32/Error-512.png`})
        .setDescription(`You are not allowed to use unlock command.`)
        .setColor('Red')

        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply({ embeds: [noPerms], ephemeral: true })

        let channel = interaction.options.getChannel(`channel`);

        channel.permissionOverwrites.create(interaction.guild.id, { SendMessages: true })

        const sucess = new EmbedBuilder()
        .setAuthor({name: `#${channel.name} has been unlocked.`, iconURL: `https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Sign-check-icon.png/800px-Sign-check-icon.png`})
        .setColor('Green')
        
        interaction.reply({ embeds: [sucess], ephemeral: true })
    }

}