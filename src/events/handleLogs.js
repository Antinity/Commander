const { EmbedBuilder, Events } = require("discord.js");

function handleLogs(client) {
  const logSchema = require("../schemas/logs");

  function send_log(guildId, embed) {
    logSchema.findOne({ Guild: guildId }, async (err, data) => {
      if (!data || !data.Channel) return;
      const LogChannel = client.channels.cache.get(data.Channel);

      if (!LogChannel) return;
      embed.setTimestamp();

      try {
        LogChannel.send({ embeds: [embed] });
      } catch (err) {
        return;
      }
    });
  }

  client.on("messageDelete", function (message) {
    try {
      if (message.guild === null) return;
      if (message.author.bot) return;

      const embed = new EmbedBuilder()
        .setTitle(`Message Deleted in ${message.channel}`)
        .setColor("Red")
        .setTimestamp()
        .setDescription(`${message.content}`)
        .setAuthor({
          name: `${message.author.tag} (${message.author.id})`,
          iconURL: `${message.author.displayAvatarURL({ dynamic: true })}`,
        })
        .setFooter({ text: `Message ID: ${message.id}` });

      // Following this embed format for every single embed message.

      return send_log(message.guild.id, embed);
    } catch (err) {
      return;
    }
  });

  // Channel Topic Updating
  client.on("guildChannelTopicUpdate", (channel, oldTopic, newTopic) => {
    try {
      if (channel.guild === null) return;

      const embed = new EmbedBuilder()
        .setTitle(`Channel Topic Updated in ${channel}`)
        .setColor("Yellow")
        .setTimestamp()
        .addFields({ name: `Previous`, value: `${oldTopic}` })
        .addFields({ name: `Updated`, value: `${newTopic}` })
        .setFooter({ text: `Channel ID: ${channel.id}` });

      return send_log(channel.guild.id, embed);
    } catch (err) {
      return;
    }
  });

  // Channel Permission Updating
  client.on(
    "guildChannelPermissionsUpdate",
    (channel, oldPermissions, newPermissions) => {
      try {
        if (channel.guild === null) return;

        const embed = new EmbedBuilder()
          .setTitle(`Channel Permissions Updated in ${channel}`)
          .setColor("Yellow")
          .setTimestamp()
          .setFooter({ text: `Channel ID: ${channel.id}` });

        return send_log(channel.guild.id, embed);
      } catch (err) {
        return;
      }
    }
  );

  // unhandled Guild Channel Update
  client.on("unhandledGuildChannelUpdate", (oldChannel, newChannel) => {
    try {
      if (oldChannel.guild === null) return;

      const embed = new EmbedBuilder()
        .setTitle(
          `Unhandled Channel Update in ${oldChannel}, ${oldChannel.guild.name}`
        )
        .setColor("Yellow")
        .setTimestamp()
        .setFooter({ text: `Channel ID: ${oldChannel.id}` });

      return send_log(oldChannel.guild.id, embed);
    } catch (err) {
      return;
    }
  });

  // Member Started Boosting
  client.on("guildMemberBoost", (member) => {
    try {
      if (member.guild === null) return;

      const embed = new EmbedBuilder()
        .setTitle(`${member.user.tag} boosted the server.`)
        .setColor("Yellow")
        .setTimestamp()
        .setFooter({ text: `Member ID: ${member.id}` });

      return send_log(member.guild.id, embed);
    } catch (err) {
      return;
    }
  });

  // Member Unboosted
  client.on("guildMemberUnboost", (member) => {
    try {
      if (member.guild === null) return;

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${member.user.tag}'s boost has ended.`,
          iconURL: member.displayAvatarURL({ dynamic: true }),
        })
        .setColor("Yellow")
        .setTimestamp()
        .setFooter({ text: `Member ID: ${member.id}` });

      return send_log(member.guild.id, embed);
    } catch (err) {
      return;
    }
  });

  // Member Got Role
  client.on("guildMemberRoleAdd", (member, role) => {
    try {
      if (member.guild === null) return;

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `Role added to ${member.user.tag}.`,
          iconURL: member.displayAvatarURL({ dynamic: true }),
        })
        .setColor("Yellow")
        .setTimestamp()
        .setDescription(`${role}`)
        .setFooter({ text: `Member ID: ${member.id}` });

      return send_log(member.guild.id, embed);
    } catch (err) {
      return;
    }
  });

  // Member Lost Role
  client.on("guildMemberRoleRemove", (member, role) => {
    try {
      if (member.guild === null) return;

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `Role removed from ${member.user.tag}.`,
          iconURL: member.displayAvatarURL({ dynamic: true }),
        })
        .setColor("Yellow")
        .setTimestamp()
        .setDescription(`${role}`)
        .setFooter({ text: `Member ID: ${member.id}` });

      return send_log(member.guild.id, embed);
    } catch (err) {
      return;
    }
  });

  // Nickname Changed
  client.on("guildMemberNicknameUpdate", (member, oldNickname, newNickname) => {
    try {
      const embed = new EmbedBuilder()
        .setColor("Yellow")
        .setTimestamp()
        .setAuthor({
          name: `${member.user.tag} changed their nickname.`,
          iconURL: member.user.displayAvatarURL({ dynamic: true }),
        })
        .addFields({
          name: `Previous`,
          value: `> ${oldNickname || `${member.user.username}`}`,
        })
        .addFields({
          name: `Updated`,
          value: `> ${newNickname || `${member.user.username}`}`,
        })
        .setFooter({ text: `Member ID: ${member.id}` });

      return send_log(member.guild.id, embed);
    } catch (err) {
      return;
    }
  });

  // Member Joined
  client.on("guildMemberAdd", (member) => {
    try {
      if (member.guild === null) return;

      const embed = new EmbedBuilder()
        .setColor("Yellow")
        .setTimestamp()
        .setAuthor({
          name: `${member.user.tag} joined the server.`,
          iconURL: member.user.displayAvatarURL({ dynamic: true }),
        })
        .setFooter({ text: `Member ID: ${member.id}` });

      return send_log(member.guild.id, embed);
    } catch (err) {
      return;
    }
  });

  // Member Left
  client.on("guildMemberRemove", (member) => {
    try {
      if (member.guild === null) return;

      const embed = new EmbedBuilder()
        .setColor("Yellow")
        .setTimestamp()
        .setAuthor({
          name: `${member.user.tag} left the server.`,
          iconURL: member.user.displayAvatarURL({ dynamic: true }),
        })
        .setFooter({ text: `Member ID: ${member.id}` });

      return send_log(member.guild.id, embed);
    } catch (err) {
      return;
    }
  });

  // Server Boost Level Up
  client.on("guildBoostLevelUp", (guild, oldLevel, newLevel) => {
    try {
      if (guild === null) return;

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${guild.name} reached boost level ${newLevel}.`,
          iconURL: guild.iconURL({ dynamic: true }),
        })
        .setColor("Yellow")
        .setTimestamp()
        .setFooter({ text: `Server ID: ${guild.id}` });

      return send_log(guild.id, embed);
    } catch (err) {
      return;
    }
  });

  // Server Boost Level Down
  client.on("guildBoostLevelDown", (guild, oldLevel, newLevel) => {
    try {
      if (guild === null) return;

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${guild.name} dropped to boost level ${newLevel}.`,
          iconURL: guild.iconURL({ dynamic: true }),
        })
        .setColor("Yellow")
        .setTimestamp()
        .setFooter({ text: `Server ID: ${guild.id}` });

      return send_log(guild.id, embed);
    } catch (err) {
      return;
    }
  });

  // Banner Added
  client.on("guildBannerAdd", (guild, bannerURL) => {
    try {
      if (guild === null) return;

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${guild.name}'s banner was updated.`,
          iconURL: guild.iconURL({ dynamic: true }),
        })
        .setColor("Yellow")
        .setTimestamp()
        .setFooter({ text: `Server ID: ${guild.id}` })
        .setImage(bannerURL);

      return send_log(guild.id, embed);
    } catch (err) {
      return;
    }
  });

  // AFK Channel Added
  client.on("guildAfkChannelAdd", (guild, afkChannel) => {
    try {
      if (guild === null) return;

      const embed = new EmbedBuilder()
        .setDescription(`AFK Channel Updated to ${afkChannel}`)
        .setColor("Yellow")
        .setTimestamp()
        .setFooter({ text: `Server ID: ${guild.id}` });

      return send_log(guild.id, embed);
    } catch (err) {
      return;
    }
  });

  // Guild Vanity Add
  client.on("guildVanityURLAdd", (guild, vanityURL) => {
    try {
      if (guild === null) return;

      const embed = new EmbedBuilder()
        .setDescription(`Vanity URL added as \`${vanityURL}\``)
        .setColor("Yellow")
        .setTimestamp()
        .setFooter({ text: `Server ID: ${guild.id}` });

      return send_log(guild.id, embed);
    } catch (err) {
      return;
    }
  });

  // Guild Vanity Remove
  client.on("guildVanityURLRemove", (guild, vanityURL) => {
    try {
      if (guild === null) return;

      const embed = new EmbedBuilder()
        .setDescription(`Vanity URL removed`)
        .setColor("Yellow")
        .setTimestamp()
        .setFooter({ text: `Server ID: ${guild.id}` });

      return send_log(guild.id, embed);
    } catch (err) {
      return;
    }
  });

  // Guild Vanity Link Updated
  client.on("guildVanityURLUpdate", (guild, oldVanityURL, newVanityURL) => {
    try {
      if (guild === null) return;

      const embed = new EmbedBuilder()
        .setDescription(`Vanity URL changed.`)
        .setColor("Yellow")
        .setTimestamp()
        .setFooter({ text: `Server ID: ${guild.id}` })
        .addFields(
          {
            name: `Previous`,
            value: `${oldVanityURL}`,
          },
          {
            name: `Updated`,
            value: `${newVanityURL}`,
          }
        );

      return send_log(guild.id, embed);
    } catch (err) {
      return;
    }
  });

  // Message Pinned
  client.on("messagePinned", (message) => {
    try {
      if (message.guild === null) return;

      const embed = new EmbedBuilder()
        .setTitle(
          `Message pinned in ${message.channel} by ${message.author.tag}`
        )
        .setColor("Yellow")
        .setTimestamp()
        .setDescription(message.content)
        .setFooter({ text: `Message ID: ${message.id}` });

      return send_log(message.guild.id, embed);
    } catch (err) {
      return;
    }
  });

  // Message Edited
  client.on("messageContentEdited", (message, oldContent, newContent) => {
    try {
      if (message.guild === null) return;
      if (message.author.bot) return;

      const embed = new EmbedBuilder()
        .setTitle(`Message edited in ${message.channel}.`)
        .setAuthor({
          name: `${message.author.tag}`,
          iconURL: message.author.avatarURL({ dynamic: true }),
        })
        .setColor("Yellow")
        .setTimestamp()
        .addFields({ name: `Previous`, value: `${oldContent}` })
        .addFields({ name: `Updated`, value: `${newContent}` })
        .setFooter({ text: `Message ID: ${message.id}` });

      return send_log(message.guild.id, embed);
    } catch (err) {
      return;
    }
  });

  // Role Position Updated
  //   client.on("rolePositionUpdate", (role, oldPosition, newPosition) => {
  //     try {
  //       if (role.guild === null) return;

  //       const embed = new EmbedBuilder()
  //         .setTitle(`Role position changed for ${role}.`)
  //         .setColor("Yellow")
  //         .addFields({ name: `Previous`, value: `${oldPosition}` })
  //         .addFields({ name: `Updated`, value: `${newPosition}` })
  //         .setTimestamp()
  //         .setFooter({ text: `Role ID: ${role.id}` });

  //       return send_log(role.guild.id, embed);
  //     } catch (err) {
  //       return;
  //     }
  //   });

  // Role Permission Updated
  client.on("rolePermissionsUpdate", (role, oldPermissions, newPermissions) => {
    try {
      if (role.guild === null) return;

      const embed = new EmbedBuilder()
        .setDescription(`Role permissions updated for ${role}.`)
        .setColor("Yellow")
        .setFooter({ text: `Role ID: ${role.id}` });

      return send_log(role.guild.id, embed);
    } catch (err) {
      return;
    }
  });

  // VC Switch
  client.on("voiceChannelSwitch", (member, oldChannel, newChannel) => {
    try {
      if (member.guild === null) return;

      const embed = new EmbedBuilder()
        .setTitle(`${member} switched voice channels.`)
        .setColor("Yellow")
        .setTimestamp()
        .setDescription(`From ${oldChannel} to ${newChannel}.`)
        .setFooter({ text: `Member ID: ${member.id}` });

      return send_log(member.guild.id, embed);
    } catch (err) {
      return;
    }
  });

  // Role Created
  client.on("roleCreate", (role) => {
    try {
      if (role.guild === null) return;

      const embed = new EmbedBuilder()
        .setTitle("Role Created")
        .setColor("Yellow")
        .setTimestamp()
        .addFields({ name: `Name`, value: `${role.name}` })
        .addFields({ name: `Colour HEX`, value: `${role.hexColor}` })
        .addFields({ name: `Position`, value: `${role.position}` })
        .setFooter({ text: `Role ID: ${role.id}` });

      return send_log(role.guild.id, embed);
    } catch (err) {
      return;
    }
  });

  // Role Deleted
  client.on("roleDelete", (role) => {
    try {
      if (role.guild === null) return;

      const embed = new EmbedBuilder()
        .setTitle("Role Deleted")
        .setColor("Yellow")
        .setTimestamp()
        .addFields({ name: `Name`, value: `${role.name}` })
        .setFooter({ text: `Role ID: ${role.id}` });

      return send_log(role.guild.id, embed);
    } catch (err) {
      return;
    }
  });

  // User Banned
  client.on(Events.GuildBanAdd, ({ guild, user }) => {
    try {
      if (guild === null) return;

      const embed = new EmbedBuilder()
        .setDescription(`${user.tag} was banned.`)
        .setColor("Yellow")
        .setTimestamp()
        .setFooter({ text: `Member ID: ${user.id}` });

      return send_log(guild.id, embed);
    } catch (err) {
      return;
    }
  });

  // User Unbanned
  client.on(Events.GuildBanRemove, ({ guild, user }) => {
    try {
      if (guild === null) return;

      const embed = new EmbedBuilder()
        .setDescription(`${user.tag} was unbanned.`)
        .setColor("Yellow")
        .setTimestamp()
        .setFooter({ text: `Member ID: ${user.id}` });

      return send_log(guild.id, embed);
    } catch (err) {
      return;
    }
  });

  // Channel Created
  client.on("channelCreate", (channel) => {
    try {
      if (channel.guild === null) return;

      const embed = new EmbedBuilder()
        .setTitle(`Channel Created`)
        .setColor("Yellow")
        .setTimestamp()
        .addFields({ name: `Name`, value: `${channel}` })
        .setFooter({ text: `Channel ID: ${channel.id}` });

      return send_log(channel.guild.id, embed);
    } catch (err) {
      return;
    }
  });

  // Channel Deleted
  client.on("channelDelete", (channel) => {
    try {
      if (channel.guild === null) return;

      const embed = new EmbedBuilder()
        .setTitle("Channel Deleted")
        .setColor("Yellow")
        .setTimestamp()
        .addFields({ name: `Name`, value: `#${channel.name}` })
        .setFooter({ text: `Channel ID: ${channel.id}` });

      return send_log(channel.guild.id, embed);
    } catch (err) {
      return;
    }
  });
}

module.exports = { handleLogs };
