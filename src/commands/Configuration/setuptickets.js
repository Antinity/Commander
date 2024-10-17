const {SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType} = require('discord.js');
const TicketSetup = require('../../schemas/TicketSetup');
const config = require('../../utils/ticket-config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setupticket')
    .setDescription('Setup ticket counter for your server.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('enable')
        .setDescription('Enable ticket system for your server.')
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('Select the channel where the ticket counter should be created.')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )
    .addChannelOption((option) =>
      option
        .setName('category')
        .setDescription('Select the parent where the tickets should be created.')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildCategory)
    )
    .addChannelOption((option) =>
      option
        .setName('transcripts')
        .setDescription('Select the channel where the transcripts should be sent.')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )
    .addRoleOption((option) =>
      option
        .setName('handlers')
        .setDescription('Select the ticket handlers or helpers role.')
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName('everyone')
        .setDescription('Select the default member role.')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('description')
        .setDescription('Choose a description for the ticket counter.')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('button')
        .setDescription('Choose a button for the ticket counter.')
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName('emoji')
        .setDescription('Choose a style, so choose a emoji.')
        .setRequired(false)
    ))
    .addSubcommand((subcommand) =>
      subcommand
        .setName('disable')
        .setDescription('Disable ticket system for your server.')
        ),
  async execute(interaction) {
    const { guild, options } = interaction;
    const subcommand = options.getSubcommand();

      if (
        !interaction.member.permissions.has(PermissionFlagsBits.Administrator) &&
        interaction.user.id !== process.env.DeveloperID.split(',')
      ) {
        const PermissionEmbed = new EmbedBuilder()
        .setColor(`Red`)
        .setDescription(`<:cross:1082334173915775046> You are not allowed to perform this action.`);
        return await interaction.reply({ embeds: [PermissionEmbed], ephemeral: true });
      }

    if (subcommand === 'enable') {

    try {
      const channel = options.getChannel('channel');
      const category = options.getChannel('category');
      const transcripts = options.getChannel('transcripts');
      const handlers = options.getRole('handlers');
      const everyone = options.getRole('everyone');
      const description = options.getString('description');
      const button = options.getString('button') || "Create Ticket";
      const emoji = options.getString('emoji');

      await TicketSetup.findOneAndUpdate(
        { GuildID: guild.id },
        {
          Channel: channel.id,
          Category: category.id,
          Transcripts: transcripts.id,
          Handlers: handlers.id,
          Everyone: everyone.id,
          Description: description,
          Button: button,
          Emoji: emoji,
        },
        {
          new: true,
          upsert: true,
        }
      );
      const embed = new EmbedBuilder().setTitle(`${interaction.guild.name} Tickets`).setDescription(description).setColor(`Blue`);
      const buttonshow = new ButtonBuilder()
        .setCustomId(button)
        .setLabel(button)
        .setStyle(ButtonStyle.Primary);

        if (emoji) buttonshow.setEmoji(emoji);
        
      await guild.channels.cache.get(channel.id).send({
        embeds: [embed],
        components: [new ActionRowBuilder().addComponents(buttonshow)],
      }).catch(error => {return});
      return interaction.reply({ embeds: [new EmbedBuilder().setDescription('<:check:1082334169197187153> The ticket panel was successfully created.').setColor('Green')], ephemeral: true});
    } catch (err) {
      console.log(err);
      const errEmbed = new EmbedBuilder().setColor('Red').setDescription(config.ticketError);
      return interaction.reply({ embeds: [errEmbed], ephemeral: true }).catch(error => {return});
    }
  }

    if (subcommand === 'disable') {

      await TicketSetup.findOneAndDelete({ GuildID: guild.id });
      return interaction.reply({ embeds: [new EmbedBuilder().setDescription('<:check:1082334169197187153> The ticket panel was successfully deleted.').setColor('Green')], ephemeral: true});

    }

  },
};