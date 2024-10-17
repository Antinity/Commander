const { Events } = require(`discord.js`);
const schema = require("../schemas/farewell")

module.exports = {
  once: false,
  name: Events.GuildMemberRemove,
  async execute(member) {

    const Data = await schema.findOne({ GuildID: member.guild.id });

    if (!Data) return;
    
    const dataCh = Data.Channel;
    if (!dataCh) return;
    let channel = member.guild.channels.cache.get(dataCh);
    if (!channel) return;
    const rawMsg = Data.Message;
    const msg = rawMsg
    .replaceAll("{member}", member)
    .replaceAll("{membername}", member.user.username)
    .replaceAll("{membertag}", member.user.discriminator)
    .replaceAll("{server}", member.guild.name)
    .replaceAll("{membercount}", member.guild.memberCount)

    channel.send({ content: `${msg}` }).catch(() => {
      return;
    });
  },
};
