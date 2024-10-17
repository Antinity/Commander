const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Find out the avatar of a member.')
    .addUserOption((option) => 
    option.setName('member')
    .setDescription('Member of the avatar you want to get')
    .setRequired(true)
    ),

    async execute(interaction) {
        const { channel, client, options, member } = interaction;
        let user = interaction.options.getUser('member') || interaction.member;
        let userAvatar = user.displayAvatarURL({ size: 512});

        const embed = new EmbedBuilder()
        .setColor('Blue')
        .setDescription(`${user.tag}'s Avatar`)
        .setImage(`${userAvatar}`)

        const button = new ButtonBuilder()
        .setLabel('Avatar Link')
        .setStyle(ButtonStyle.Link)
        .setURL(`${user.avatarURL({size: 512})}`);

        const row = new ActionRowBuilder().addComponents(button);

        await interaction.reply({
            embeds: [embed],
            components: [row],
        });
    },
};
