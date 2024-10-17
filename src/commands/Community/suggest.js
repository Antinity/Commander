const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const schema = require('../../schemas/suggestion');

module.exports = {
data: new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('Suggest something for the server!')
    .addStringOption(option => option.setName('suggestion').setDescription('Your suggestion, make sure to be detailed and include all the information.').setRequired(true)),
async execute(interaction) {
    
    const Data = await schema.findOne({
        Guild: interaction.guild.id,
    });

    if (!Data) {
        const embed = new EmbedBuilder()
        .setDescription(
            `<:cross:1082334173915775046> Suggestion command is disabled on this server.`
        )
        .setColor(`Red`);

        return await interaction.reply({ embeds: [embed], ephemeral: true });

    } else { 

        const suggestion = interaction.options.getString('suggestion');
        const channel = interaction.guild.channels.cache.get(Data.Channel);
        
        const embed = new EmbedBuilder()
        .setDescription(suggestion)
        .setColor(`Blue`)
        .setAuthor({ name: `Suggestion by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})

        channel.send({ embeds: [embed] }).then(async (msg) => {
            await msg.react(`⬆️`);
            await msg.react(`⬇️`);
        }
        )
        .then(() => {

            const embed = new EmbedBuilder()
            .setDescription(`<:check:1082334169197187153> Your suggestion has been sent to ${channel}.`)
            .setColor(`Green`);

            interaction.reply({ embeds: [embed], ephemeral: true } );

        })
    }

    }
};