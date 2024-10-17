const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, PermissionFlagsBits } = require('discord.js');
const levelSchema = require("../../schemas/level")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('List the top 10 members based on their XP.'),

    async execute (interaction) {

        const { guild, client } = interaction;

        let text = "";

        const noLead = new EmbedBuilder()
            .setColor(`Red`)
            .setAuthor({name: `No one has reached the leaderboard yet.`, iconURL: `https://cdn0.iconfinder.com/data/icons/shift-interfaces/32/Error-512.png`});

        const data = await levelSchema.find({Guild: guild.id})
            .sort({
                XP: -1,
                Level: -1
            })
            .limit(10);

        if (!data.length) {
            return await interaction.reply({embeds: [noLead], ephemeral: true});
        }

        const loading = new EmbedBuilder()
            .setColor(`Blue`)
            .setDescription(`Loading leaderboard for ${guild.name}, please wait...`);

        await interaction.reply({embeds: [loading] })

        for (let i = 0; i < data.length; i++) {
            const { User, XP, Level } = data[i];

            const value = await client.users.fetch(User) || "Unknown Member";
            const member = value.tag;

            text += `#${i + 1}. ${member} • Level: ${Level} • XP: ${XP}\n`;

            const lbEmbed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle(`🏆 ${interaction.guild.name}'s Leaderboard`)
                .setDescription(`\`\`\`${text}\`\`\``);

            interaction.editReply({embeds: [lbEmbed]});
        }
    }
}
