const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const warnSchema = require(`../../schemas/warnSchema`)

module.exports = {

    data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn or remove a warning from a member..')
    .addSubcommand(subcommand => subcommand
        .setName(`add`)
        .setDescription(`Add a warning to a member.`)
        .addUserOption(option => option.setName(`member`).setDescription('Select the member to warn.').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Specify the reason for the warn.').setRequired(false))
        )
    .addSubcommand(subcommand => subcommand
        .setName(`clear`)
        .setDescription(`Clear all warnings from a member.`)
        .addUserOption(option => option.setName(`member`).setDescription('Select the member to clear warnings.').setRequired(true))),

    async execute (interaction) {

        const subcommand = interaction.options.getSubcommand();
        const member = interaction.options.getUser(`member`);

            if (
              !interaction.member.permissions.has(PermissionFlagsBits.KickMembers) &&
              interaction.user.id !== process.env.DeveloperID.split(',')
            ) {
              const PermissionEmbed = new EmbedBuilder()
                .setColor(`Red`)
                .setDescription(`<:cross:1082334173915775046> You are not allowed to perform this action.`);
              return await interaction.reply({ embeds: [PermissionEmbed], ephemeral: true });
            }
        
        if (subcommand === `add`) {
        let reason = interaction.options.getString(`reason`) || "Unknown reason";

        const dmEmbed = new EmbedBuilder()
        .setDescription(`<:alert:1082334164189184051> You were warned in **${interaction.guild.name}**.\nReason: ${reason}`)
        .setColor('Red')

        const sucess = new EmbedBuilder()
        .setDescription(`<:check:1082334169197187153> **${member.tag}** has been warned.\nReason: ${reason}.`)
        .setColor('Green')

        const currentDate = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const locale = 'en-US';
        const humanDate = currentDate.toLocaleDateString(locale, options);

        const DataWarn = new warnSchema({
            GuildID: interaction.guild.id,
            UserID: member.id,
            Date: humanDate,
            Reason: [reason],
            Moderator: interaction.user.tag,
        });
        

        await interaction.reply({ embeds: [sucess] })

        await member.send({ embeds: [dmEmbed] }).catch(err => {
            return;
        })

        await DataWarn.save()
    }

    if (subcommand === `clear`) {

        const sucess = new EmbedBuilder()
        .setDescription(`<:check:1082334169197187153> Warnings has been cleared from **${member.tag}**.`)
        .setColor('Green')

        const fail = new EmbedBuilder()
        .setDescription(`<:cross:1082334173915775046> Unable to clear warns from **${member.tag}**.`)

        try {

        await warnSchema.deleteMany({ GuildID: interaction.guild.id, UserID: member.id });
        await interaction.reply({ embeds: [sucess] });
        } catch (err) {
        await interaction.reply({ embeds: [fail], ephemeral: true });
        }
    }
}
}