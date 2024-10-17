const {
  Events,
  EmbedBuilder,
  ChannelType,
  PermissionsBitField,
  PermissionFlagsBits,
} = require("discord.js");
const joinSchema = require("../schemas/jointocreate");
const joinChannelSchema = require("../schemas/joinToCreateChannel");

module.exports = {
  name: Events.VoiceStateUpdate,
  once: false,
  async execute(oldState, newState) {
    try {
      if (newState.member.guild === null || !newState.member.guild) return;
    } catch (err) {
      return;
    }
    const joinData = await joinSchema.findOne({
      Guild: newState.member.guild.id,
    });
    const joinChannelData = await joinChannelSchema.findOne({
      Guild: newState.member.guild.id,
    });
    if (!joinData || !joinChannelData) return;

    const voiceChannel = newState.channel;

    if (!voiceChannel) return;
    else {
      if (voiceChannel.id === joinData.Channel) {
        if (joinChannelData) {
          try {
            const alr = new EmbedBuilder()
              .setColor(`Red`)
              .setDescription(
                `<:cross:1082334173915775046> You already have a private channel open in **${newState.member.guild.name}**.`
              );
            return await newState.member.send({ embeds: [alr] });
          } catch (err) {
            return;
          }
        }
      } else {
        try {
          const channel = await newState.member.guild.channels.create({
            type: ChannelType.GuildVoice,
            name: `${newState.member.user.username}'s Private.`,
            parent: joinData.Category,
            permissionOverwrites: [
              {
                id: newState.member.user.id,
                allow: [
                  PermissionFlagsBits.ManageChannels |
                    PermissionFlagsBits.ViewChannel,
                ],
              },
              {
                id: newState.member.guild.roles.everyone,
                deny: [PermissionFlagsBits.ViewChannel],
              },
            ],
          });
          try {
            await newState.member.voice.setChannel(channel.id);
          } catch (err) {
            return;
          }

          setTimeout(() => {
            joinChannelSchema.create({
              Guild: newState.member.guild.id,
              Channel: channel.id,
              User: newState.member.user.id,
            });
          }, 500);
        } catch (errr) {
          try {
            const err = new EmbedBuilder()
              .setColor(`Red`)
              .setDescription(
                `<:cross:1082334173915775046> An error occurred while creating your private channel. Please try again later.`
              );
            await newState.member.send({ embeds: err });
          } catch (err) {
            return;
          }
        }

        try {
          const embed = new EmbedBuilder()
            .setColor(`Green`)
            .setDescription(
              `<:check:1082334169197187153> Your private voice channel has been created in **${newState.member.guild.name}**.`
            );
          await newState.member.send({ embeds: embed });
        } catch (err) {
          return;
        }
      }
    }
  },
};
