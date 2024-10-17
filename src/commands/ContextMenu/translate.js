const {
    ContextMenuInteraction,
    EmbedBuilder,
    ContextMenuCommandBuilder,
    ApplicationCommandType,
} = require("discord.js");
const translate = require("@iamtraction/google-translate");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("Translate to English")
        .setType(ApplicationCommandType.Message),
    /**
     * 
     * @param {ContextMenuInteraction} interaction 
     */
    async execute(interaction) {
        const { channel, targetId } = interaction

        const query = await channel.messages.fetch(targetId)
        const raw = query.content

        const translated = await translate(query, { to: "en" })

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Blue")
                    .setTitle(`Translated to English Language.`)
                    .addFields(
                        {
                            name: `Previous:`,
                            value: `\`\`\`${raw}\`\`\``,
                        },
                        {
                            name: `Translated text:`,
                            value: `\`\`\`${translated.text}\`\`\``,
                        }
                    )
            ]
        }).catch(err => {
            console.log(err)
        })
    }
}