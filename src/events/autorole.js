const { Events } = require(`discord.js`);
const schema = require(`../schemas/autorole`)

module.exports = {
  once: false,
  name: Events.GuildMemberAdd,
  async execute(member) {

    const data = await schema.findOne({
      GuildID: member.guild.id,
    });
    if (!data) return;

    const role = member.guild.roles.cache.get(data.Role);
    if (!role) return;

    if (member.roles.cache.has(role.id)) return;

    member.roles.add(role).catch((err) => {
      return;
    });
  },
};