const { EmbedBuilder } = require("discord.js");
const cooldowns = new Map();
const cooldownDuration = process.env.Cooldown;
const errChannelID = process.env.ErrorChannelID;

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);
        const errChannel = client.channels.cache.get(errChannelID);

        if (!command) return;

        const errNotify = new EmbedBuilder()
        .setColor(`Red`)
        .setTitle(`An error has occurred in ${client.user.tag}.`);

        const cooldownEmbed = new EmbedBuilder()
        .setColor('Red')
        .setDescription(`<:cross:1082334173915775046> Please wait ${cooldownDuration / 1000} seconds before using this command again.`);

        if (cooldowns.has(interaction.user.id)) return interaction.reply({
            embeds: [cooldownEmbed],
            ephemeral: true
        });

        try{
            await command.execute(interaction, client).then(() => {
                cooldowns.set(interaction.user.id, Date.now());
                setTimeout(() => {
                    cooldowns.delete(interaction.user.id);
                }, cooldownDuration);
            });
        } catch (e) {
            console.log(e);
            const errorEmbed = new EmbedBuilder()
            .setColor('Red')
            .setDescription(`<:cross:1082334173915775046> An unexpected error occured!\nPlease use \`/bugreport\` command to report this issue.\n\`\`\`js\n${e}\`\`\``);
            await interaction.reply({
                embeds: [errorEmbed],
                ephemeral: true
            });
            if (!errChannel) return console.log(`Error channel not found.`)
            errChannel.send({ embeds: [errNotify.setDescription("```" + e + "```")] });
        } 
    },
};
