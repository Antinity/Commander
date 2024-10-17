const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
data: new SlashCommandBuilder()
    .setName('rockpaperscissors')
    .setDescription('Play rock paper scissors with the bot!')
    .addStringOption(option => option.setName('choice').setDescription('Choose rock, paper, or scissors!')
    .addChoices({name: 'Rock', value: 'Rock'}, {name: 'Paper', value: 'Paper'}, {name: 'Scissors', value: 'Scissors'}) 
    .setRequired(true)),
async execute(interaction) {
    
    const choices = ['Rock', 'Paper', 'Scissors'];
    const response = choices[Math.floor(Math.random() * choices.length)];
    const userChoice = interaction.options.getString('choice');

    if (userChoice.toLowerCase() === response) {
        const embed = new EmbedBuilder()
        .setTitle('Rock Paper Scissors')
        .setDescription(`You choose *${userChoice}*.\nI choose *${response}*.\n\n**It's a tie!**`)
        .setColor('Blue')

        await interaction.reply({ embeds: [embed] });
    }
    if (userChoice.toLowerCase() === 'rock' && response.toLowerCase() === 'paper') {
        const embed = new EmbedBuilder()
        .setTitle('Rock Paper Scissors')
        .setDescription(`You choose *${userChoice}*.\nI choose *${response}*.\n\n**I win!**`)
        .setColor('Blue')

        await interaction.reply({ embeds: [embed] });
    }
    if (userChoice.toLowerCase() === 'rock' && response.toLowerCase() === 'scissors') {
        const embed = new EmbedBuilder()
        .setTitle('Rock Paper Scissors')
        .setDescription(`You choose *${userChoice}*.\nI choose *${response}*.\n\n**You win!**`)
        .setColor('Blue')

        await interaction.reply({ embeds: [embed] });
    }
    if (userChoice.toLowerCase() === 'paper' && response.toLowerCase() === 'rock') {
        const embed = new EmbedBuilder()
        .setTitle('Rock Paper Scissors')
        .setDescription(`You choose *${userChoice}*.\nI choose *${response}*.\n\n**You win!**`)
        .setColor('Blue')

        await interaction.reply({ embeds: [embed] });
    } else if (userChoice.toLowerCase() === 'paper' && response.toLowerCase() === 'scissors') {
        const embed = new EmbedBuilder()
        .setTitle('Rock Paper Scissors')
        .setDescription(`You choose *${userChoice}*.\nI choose *${response}*.\n\n**I win!**`)
        .setColor('Blue')

        await interaction.reply({ embeds: [embed] });
    }
    if (userChoice.toLowerCase() === 'scissors' && response.toLowerCase() === 'rock') {
        const embed = new EmbedBuilder()
        .setTitle('Rock Paper Scissors')
        .setDescription(`You choose *${userChoice}*.\nI choose *${response}*.\n\n**I win!**`)
        .setColor('Blue')

        await interaction.reply({ embeds: [embed] });
    }
    if (userChoice.toLowerCase() === 'scissors' && response.toLowerCase() === 'paper') {
        const embed = new EmbedBuilder()
        .setTitle('Rock Paper Scissors')
        .setDescription(`You choose *${userChoice}*.\nI choose *${response}*.\n\n**You win!**`)
        .setColor('Blue')

        await interaction.reply({ embeds: [embed] });
    }
    }
};
