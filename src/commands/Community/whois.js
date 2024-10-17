const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { profileImage } = require("discord-arts");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("whois")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("Select the member you want to view the info of.")
        .setRequired(false)
    )
    .setDescription("Find a detailed information about a member."),
  async execute(interaction, client) {
    await interaction.deferReply();

    let user = interaction.options.getUser("member") || interaction.user;
    let member = await interaction.guild.members.cache.get(user.id);
    let flags = user.flags.toArray();
    const profileBuffer = await profileImage(member.id);
    const attachment = new AttachmentBuilder(profileBuffer, {
      name: "user-info.png",
    });

    let roles = [];
    await Promise.all(
      member.roles.cache.map(async (role) => {
        if (role.id === interaction.guild.id) return;
        else {
          roles.push(role);
        }
      })
    );

    let badges = [];

    if (user.bot) {
      badges.push("<:application:1109185490952917174>");
    }

    await Promise.all(
      flags.map(async (badge) => {
        if (badge === "Staff") badges.push("<:staff:1084472284187742318>");
        if (badge === "Partner") badges.push("<:partner:1084474619743981628>");
        if (badge === "CertifiedModerator")
          badges.push("<:certifiedmod:1109032540452429877>");
        if (badge === "Hypesquad")
          badges.push("<:hypesquad:1109031768977322004>");
        if (badge === "HypeSquadOnlineHouse1")
          badges.push("<:bravery:1109030989881147412>");
        if (badge === "HypeSquadOnlineHouse2")
          badges.push("<:brilliance:1109031274875715635>");
        if (badge === "HypeSquadOnlineHouse3")
          badges.push("<:balance:1109031393427738654>");
        if (badge === "BugHunterLevel1")
          badges.push("<:bughunterlvl1:1109032099421372469>");
        if (badge === "BugHunterLevel2")
          badges.push("<:bughunterlvl2:1109032159852904449>");
        if (badge === "ActiveDeveloper")
          badges.push("<:active_dev:1084474003672027136>");
        if (badge === "VerifiedDeveloper")
          badges.push("<:verified_bot_dev:1084473617007509514>");
        if (badge === "PremiumEarlySupporter")
          badges.push("<:earlysupporter:1109031899206254633>");

        if (badge === "Spammer") badges.push("<:spammer:1109041403591397448>");
        if (badge === "TeamPseudoUser")
          badges.push("<:team:1109042806485426196>");
        if (badge === "VerifiedBot")
          badges.push(
            "<:verifiedhalf1:1109184665694257302><:verifiedhalf2:1109184711508627537> "
          );
      })
    );

    const userData = await fetch(
      `https://japi.rest/discord/v1/user/${user.id}`
    );
    const { data } = await userData.json();

    if (data.public_flags_array) {
      await Promise.all(
        data.public_flags_array.map(async (badge) => {
          if (badge === "NITRO") badges.push("<:nitro:1109043620553695284>");
        })
      );
    }

    if (member.premiumSinceTimestamp) {
      let claimed = "";

      if (member.premiumSinceTimestamp + 2629800000 * 24 < Date.now()) {
        if (!claimed || claimed === "") {
          badges.push("<:nitrostage9:1109051992099258389>");
          claimed = "yes";
        }
      }

      if (member.premiumSinceTimestamp + 2629800000 * 15 < Date.now()) {
        if (!claimed || claimed === "") {
          badges.push("<:nitrostage8:1109051988001423361>");
          claimed = "yes";
        }
      }

      if (member.premiumSinceTimestamp + 2629800000 * 15 < Date.now()) {
        if (!claimed || claimed === "") {
          badges.push("<:nitrostage7:1109051981231824956>");
          claimed = "yes";
        }
      }

      if (member.premiumSinceTimestamp + 2629800000 * 12 < Date.now()) {
        if (!claimed || claimed === "") {
          badges.push("<:nitrostage6:1109051976588738560>");
          claimed = "yes";
        }
      }

      if (member.premiumSinceTimestamp + 2629800000 * 9 < Date.now()) {
        if (!claimed || claimed === "") {
          badges.push("<:nitrostage5:1109051972151169045>");
          claimed = "yes";
        }
      }

      if (member.premiumSinceTimestamp + 2629800000 * 6 < Date.now()) {
        if (!claimed || claimed === "") {
          badges.push("<:nitrostage4:1109051964928569354>");
          claimed = "yes";
        }
      }

      if (member.premiumSinceTimestamp + 2629800000 * 3 < Date.now()) {
        if (!claimed || claimed === "") {
          badges.push("<:nitrostage3:1109051960197402695>");
          claimed = "yes";
        }
      }

      if (member.premiumSinceTimestamp + 2629800000 * 2 < Date.now()) {
        if (!claimed || claimed === "") {
          badges.push("<:nitrostage2:1109051957919887421>");
          claimed = "yes";
        }
      }

      if (member.premiumSinceTimestamp + 2629800000 * 2 > Date.now()) {
        if (!claimed || claimed === "") {
          badges.push("<:nitrostage1:1109051954027565136>");
          claimed = "yes";
        }
      }
    }

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setAuthor({
        name: `${user.tag}`,
        iconURL: `${user.displayAvatarURL({ dynamic: true, size: 512 })}`,
      })
      .addFields({ name: "👑 Member", value: `${user}`, inline: true })
      .addFields({
        name: "📂 Roles",
        value: `${roles.join(" ")}`,
        inline: true,
      })
      .addFields({
        name: "📛 Badges",
        value: `${badges.join(" ") || "None"}`,
        inline: true,
      })
      .addFields(
        {
          name: "🚪 Joined",
          value: `<t:${parseInt(member.joinedAt / 1000)}:R>`,
          inline: true,
        },
        {
          name: "🌎 Created",
          value: `<t:${parseInt(user.createdAt / 1000)}:R>`,
          inline: true,
        },
        {
          name: "👤 Nickname",
          value: member.nickname || "None",
          inline: true,
        }
      )
      .setImage("attachment://user-info.png")
      .setFooter({ text: `🔎 ID: ${user.id}` });

    if (member.premiumSinceTimestamp)
      embed.addFields({
        name: "🏆 Booster Since",
        value: `<t:${Math.floor(member.premiumSinceTimestamp / 1000)}:R>`,
      });

    await interaction.editReply({ embeds: [embed], files: [attachment] });
  },
};
