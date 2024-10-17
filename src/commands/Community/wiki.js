const wiki = require('wikijs').default();
const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js')

var timeout = [];

module.exports = {
    data: new SlashCommandBuilder()
    .setName('wiki')
    .setDMPermission(false)
    .setDescription('Search the wikipedia.')
    .addStringOption(option => option.setName('query').setDescription('Specify what you want to search for.').setRequired(true).setMaxLength(200)),
    async execute (interaction) {

        const query = interaction.options.getString('query');

        await interaction.deferReply();

        timeout.push(interaction.user.id);
        setTimeout(() => {
            timeout.shift();
        }, 10000)


        const search = await wiki.search(query);

        const embed1 = new EmbedBuilder()
            .setColor("Red")
            .setDescription(`<:cross:1082334173915775046> No results were found for **${query}**.`);

        if (!search.results.length) return await interaction.editReply({ embeds: [embed1], ephemeral: true});

        const result = await wiki.page(search.results[0]);

        const summary = await result.summary();
        if (summary.length > 4000) return summary = `${summary.slice(0, 4000)}...`;
        
        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle(`${result.raw.title}`)
        .setDescription(`${summary.slice(0, 4000)}`)
 
        await interaction.editReply({ embeds: [embed], ephemeral: false});
    
        

    }
}