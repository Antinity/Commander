const { Events, EmbedBuilder } = require("discord.js");
const afkSchema = require("../schemas/afkSchema");

module.exports = {
  once: false,
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;

    const check = await afkSchema.findOne({
      Guild: message.guild.id,
      User: message.author.id,
    });

    if (check && message.author.id === check.User) {
      const nick = check.Nickname;
      await afkSchema.deleteMany({
        Guild: message.guild.id,
        User: message.author.id,
      });
    
      await message.member.setNickname(`${nick}`).catch((err) => {
        return;
      });
    
      const m1 = await message.reply({
        content: `Welcome ${message.author}, your AFK status has been removed.`,
        ephemeral: true,
      });
      setTimeout(() => {
        m1.delete();
      }, 3000);    
    } else {
      const members = message.mentions.users.first();
      if (!members) return;
      const Data = await afkSchema.findOne({
        Guild: message.guild.id,
        User: members.id,
      });
      if (!Data) return;

      const member = message.guild.members.cache.get(members.id);
      let msg = "";
      if (Data && Data.Message) {
        msg = ` for ${Data.Message}`;
      }
      
      if (message.content.includes(members)) {
        const m = await message.reply({
          content: `${member.user.tag} is currently AFK${msg}.`,
        });
        setTimeout(() => {
          m.delete();
        }, 3000);
      }      
    }
  },
};
