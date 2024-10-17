const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder, ComponentType } = require('discord.js');
const fs = require('fs');

module.exports = {
data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Find out more about the bot on how to use it.'),
async execute(interaction, client) {

    const menu = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
        .setCustomId('helpMenu')
        .setMaxValues(1)
        .setMinValues(1)
        .setPlaceholder('🚀 Select a help category...')
        .addOptions([
            {
                label: '👤 Community',
                description: 'Basic and engagement based commands.',
                value: 'Community',
            },
            {
                label: '⚙️ Configuration',
                description: 'Customization and setup based commands.',
                value: `Configuration`
            },
            {
                label: '⚒️ Moderation',
                description: 'Moderation and management based commands.',
                value: `Moderation`
            },
            {
                label: '🖱️ Context Menu',
                description: 'Context Menu and mouse based commands.',
                value: `ContextMenu`
            },
            {
                label: '😆 Entertainment',
                description: 'Fun and entertainment based commands.',
                value: `Entertainment`
            },
            {
                label: '🎉 Giveaways',
                description: 'Giveaway and raffle based commands.',
                value: `Giveaways`
            },
            {
                label: '🧲 Other',
                description: 'Other and miscellaneous based commands.',
                value: `Other`
            },

        ]))

    const embed = new EmbedBuilder()
    .setColor(`Blue`)
    .setAuthor({ name: `🧩 ${client.user.username} Help Center` })
    .setDescription(`**${client.user.username}** is an [open source](https://github.com/Antinity/Commander) project, Being Maintained By [CatCoder123#3666](https://github.com/catkoder123) and [Antinity#0001](https://github.com/Antinity), which is a powerful Discord bot written in JavaScript and Node.js, and Discord.js v14 library, created by the [YouTuber Antinity](https://youtube.com/@antinityfx) and [YouTuber CatCoder123](https://youtube.com/@catcoder123). This bot is designed to enhance your Discord server experience by providing a wide range of features and commands for managing, moderating, and customizing your server.`)
    .addFields({ name: `Total Commands`, value: `${client.commands.size}`, inline: true },
    { name: `Total Servers`, value: `${client.guilds.cache.size}`, inline: true },
    { name: `Total Members`, value: `${client.users.cache.size}`, inline: true },)

    const helpMessage = await interaction.reply({ embeds: [embed], components: [menu] })
    
    }
};