const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder } = require(`discord.js`);
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Manage the slowmode of a channel.')
        .addSubcommand(subcommand => subcommand
            .setName('set')
            .setDescription('Set the slowmode of a channel.')
            .addChannelOption(option => option
                .setName('channel')
                .setDescription('Select the channel to set the slowmode of.')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
            )
            .addIntegerOption(option => option
                .setName('time')
                .setDescription('Specify the time of the slowmode.')
                .setRequired(true)
                .setMinValue(1)
            )
            .addStringOption(option => option
                .setName('timeformat')
                .setDescription('Select the time format of the slowmode.')
                .addChoices(
                    { name: 'Seconds', value: 'seconds' },
                    { name: 'Minutes', value:'minutes' },
                    { name: 'Hours', value: 'hours' },
                )
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('disable')
            .setDescription('Disable the slowmode of a channel')
            .addChannelOption(option => option
                .setName('channel')
                .setDescription('The channel to disable the slowmode of')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
            )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .setDMPermission(false),
 
    async execute(interaction) {
 
        // Get the Command Options
        const channel = interaction.options.getChannel('channel');
        const time = interaction.options.getInteger('time');
        const timeformat = interaction.options.getString('timeformat');
 
        // Transfer the time to the correct format
        let timeInSeconds = 0;
        switch (timeformat) {
            case'seconds':
                timeInSeconds = time;
                break;
            case'minutes':
                timeInSeconds = time * 60;
                break;
            case 'hours':
                timeInSeconds = time * 60 * 60;
                break;
        }

        const slower6hr = new EmbedBuilder()
        .setDescription(`<:cross:1082334173915775046> The slowmode for ${channel} can't be longer than 6 hours.`)
        .setColor('Red')
        if (timeInSeconds > 21600) return interaction.reply({embeds: [slower6hr], ephemeral: true})

        const setSucess = new EmbedBuilder()
        .setDescription(`<:check:1082334169197187153> The slowmode for ${channel} has been set to ${time} ${timeformat}.`)
        .setColor('Green')

        const disSucess = new EmbedBuilder()
        .setDescription(`<:check:1082334169197187153> The slowmode for ${channel} has been disabled.`)
        .setColor('Green')
 
        switch (interaction.options.getSubcommand()) {
            case'set':
                await channel.setRateLimitPerUser(timeInSeconds);
                interaction.reply({ embeds: [setSucess]});
                break;
            case 'disable':
                await channel.setRateLimitPerUser(0);
                interaction.reply({ embeds: [disSucess]});
                break;
        }
 
    },
}