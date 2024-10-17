const { Events } = require("discord.js");
const joinChannelSchema = require("../schemas/joinToCreateChannel");

module.exports = {
  name: Events.VoiceStateUpdate,
  once: false,
  async execute (oldState, newState) {
    try {
        if (oldState.member.guild === null) return;
    } catch (er) {
        return;
    }

    const leavechanneldata = await joinChannelSchema.findOne({ Guild: oldState.member.guild.id, User: oldState.member.user.id });

    if (!leavechanneldata) return;

    else {
        const voicechannel = await oldState.member.guild.cache.get(leavechanneldata.Channel)
        try {
            await voicechannel.delete();
        } catch (e) {
            return;
        }
        await joinChannelSchema.deleteMany({Guild: oldState.guild.id, User: oldState.member.id})

        try {
            const embed = new EmbedBuilder()
            .setColor(`Green`)
            .setDescription(
              `<:check:1082334169197187153> Your private voice channel has been created in **${newState.member.guild.name}**.`
            );
            await newState.member.send({ embeds: [embed] });
        } catch (e) {
            return;
        }
    }

  },
};