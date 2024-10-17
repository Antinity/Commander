const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const devID = process.env.DeveloperID.split(',');

module.exports = {
data: new SlashCommandBuilder()
    .setName('devserverlist')
    .setDescription('Lists all servers the bot is in.'),
async execute(interaction, client) {
    
    // Check if the user is a developer
    console.log(devID)

    const notDev = new EmbedBuilder()
    .setDescription("You are not a developer!")
    .setColor(`Red`)
    
    if (!devID.includes(interaction.user.id)) {
        return interaction.reply({ embeds: [notDev], ephemeral: true})
    }

    // Get the bot's guilds and join with a nwew line wit its id
    const guilds = client.guilds.cache.map(guild => `${guild.name} - ${guild.id}`).join('\n');

    console.log(`\nSERVER LIST:\n` + `${client.guilds.cache.size} Servers` + `\n` + guilds)

    const embed = new EmbedBuilder()
    .setDescription(`Logged server list to console.`)
    .setColor(`Blue`)
    interaction.reply({embeds: [embed]})    

    }
  };