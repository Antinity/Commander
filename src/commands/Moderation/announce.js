const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const validUrl = require('valid-url');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Send an announcement to a specific channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option => option.setName('channel').setDescription('The channel where you want it to go').addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement).setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('The role you want to mention. (optional)').setRequired(true))
        .addStringOption(option => option.setName('title').setDescription('Title of the announcement.').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('Message contents of the announcement.').setRequired(true))
        .addStringOption(option => option
            .setName(`color`)
            .setDescription(`Color of the announcement embed message.`)
            .addChoices(
                { name: "Red", value: "Red" },
                { name: "Blue", value: "Blue" },
                { name: "Green", value: "Green" },
                { name: "Yellow", value: "Yellow" },
                { name: "Purple", value: "Purple" },
                { name: "Gold", value: "Gold" },
                { name: "Orange", value: "Orange" },
                { name: "Magenta", value: "Magenta" },
                { name: "Dark Red", value: "Red" },
                { name: "Dark Blue", value: "DarkBlue" },
                { name: "Dark Gray", value: "DarkGray" },
                { name: "Dark Green", value: "DarkGreen" },
                { name: "Dark Purple", value: "DarkPurple" },
                { name: "Light Gray", value: "LightGrey" },
                { name: "Blurple", value: "Blurple" },
                { name: "Grayple", value: "Greyple" },
                { name: "Dark But Not Black", value: "DarkButNotBlack" },
                { name: "Not Quite Black", value: "NotQuiteBlack" }))
        .addStringOption(option => option.setName('image').setDescription('Image link. (optional)').setRequired(false)),
    async execute(interaction) {
        const { options } = interaction;

        const channel = options.getChannel('channel');
        const role = options.getRole('role');
        const title = options.getString('title');
        const message = options.getString('message');
        const image = options.getString('image') || null;
        const color = options.getString(`color`) || 'DarkButNotBlack'

        const invalidlinkembed = new EmbedBuilder()
            .setAuthor({ name: `Please enter a valid direct image link.`, iconURL: `https://cdn0.iconfinder.com/data/icons/shift-interfaces/32/Error-512.png` })
            .setColor('Red')

        const error = new EmbedBuilder()
            .setAuthor({ name: `Unable to announce due to an interal error.`, iconURL: `https://cdn0.iconfinder.com/data/icons/shift-interfaces/32/Error-512.png` })
            .setColor('Red')

        if (image && !validUrl.isUri(image)) {
            return interaction.reply({ embeds: [invalidlinkembed], ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle(`:loudspeaker:  ${title}`)
            .setColor(color)
            .setDescription(`${message}`)
            .setImage(image)

        await channel.send({ embeds: [embed], content: `${role}` }).catch(err => {
            message.reply({contents: "This color does not exist! Please choose one from predefined colors or enter a hex.",ephemeral: true})
        })
        await interaction.reply({ content: `Announcement sent to ${channel}`, ephemeral: true })
    }
}