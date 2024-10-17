const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription(`Find out your ping.`),
    async execute(interaction) {

        const ping = Date.now() - interaction.createdTimestamp

        const pingEmbed = new EmbedBuilder()
        .setColor('Blue')
        .setDescription(`:hourglass: Your Ping is ${ping} ms`)
        
         await interaction.reply({ embeds: [pingEmbed] });
    }

}