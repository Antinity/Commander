const { SlashCommandBuilder } = require(`@discordjs/builders`);
const ms = require("ms");
const { mongoose } = require(`mongoose`);
const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`giveaway`)
    .setDescription(`Manage your giveaways with start, edit, end or reroll.`)
    .addSubcommand((subcommand) =>
      subcommand
        .setName(`start`)
        .setDescription(`Start a new giveaway.`)
        .addStringOption((option) =>
          option
            .setName("duration")
            .setDescription(
              "The duration of the giveaway (ending in s/m/h/d...)"
            )
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("winners")
            .setDescription("The Amount Of Winners")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("prize")
            .setDescription("The prize For The Giveaway")
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel for  The Giveaway")
        )
        .addStringOption((option) =>
          option
            .setName("content")
            .setDescription("The Content Of The Giveaway")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(`edit`)
        .setDescription(`Edit an onoing giveaway.`)
        .addStringOption((option) =>
          option
            .setName("message_id")
            .setDescription("The Message id For Giveaway")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("time")
            .setDescription("The duration of the giveaway In Milliseconds")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("winners")
            .setDescription("The Amount Of Winners")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("prize")
            .setDescription("The prize For The Giveaway")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(`end`)
        .setDescription(`End an onoing giveaway.`)
        .addStringOption((option) =>
          option
            .setName("message_id")
            .setDescription("The Message id For Giveaway")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(`reroll`)
        .setDescription(`Reroll an onoing giveaway.`)
        .addStringOption((option) =>
          option
            .setName("message_id")
            .setDescription("The Message id Of the Giveaway")
            .setRequired(true)
        )
    ),

  async execute(interaction, client) {

      if (
        !interaction.member.permissions.has(PermissionFlagsBits.ManageGuild || PermissionFlagsBits.ManageChannels || PermissionFlagsBits.ModerateMembers) &&
        interaction.user.id !== process.env.DeveloperID.split(',')
      ) {
        const PermissionEmbed = new EmbedBuilder()
        .setColor(`Red`)
        .setDescription(`<:cross:1082334173915775046> You are not allowed to perform this action.`);
        return await interaction.reply({ embeds: [PermissionEmbed], ephemeral: true });
      }
    
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === `start`) {
      if (!mongoose.connect) await interaction.reply(`no Mongodb Url Provided`);

      await interaction.reply({
        embeds: [new EmbedBuilder().setDescription(`Starting the giveaway...`)],
        ephemeral: true,
      });

      const { GiveawaysManager } = require("discord-giveaways");

      const duration = ms(interaction.options.getString("duration"));
      const winnerCount = interaction.options.getInteger("winners");
      const prize = interaction.options.getString("prize");
      const contentmain = interaction.options.getString(`content`);
      const channel = interaction.options.getChannel("channel");
      if (!channel && !contentmain)
        client.giveawayManager.start(interaction.channel, {
          prize,
          winnerCount,
          duration,
          hostedBy: interaction.user,
          privateMessageInformation: true,
          messages: {
            replyToGiveaway: true,
            giveaway: "🎉 **GIVEAWAY** 🎉",
            giveawayEnded: "🎉 **GIVEAWAY ENDED** 🎉",
            title: "Prize: {this.prize}",
            drawing: "Ends {timestamp}",
            dropMessage: "Be the first, and react to 🎉!",
            inviteToParticipate: "React with 🎉 to enter the giveaway!",
            winMessage: "Congratulations, {winners}! You won **{this.prize}**.\n{this.messageURL}",
            embedFooter: "{this.winnerCount} winners",
            noWinner: "Giveaway cancelled, no valid participations.",
            hostedBy: "Hosted by {this.hostedBy}",
            winners: "Winners:",
            endedAt: "Ended",
            paused: "⚠️ This giveaway is paused!",
            infiniteDurationText: "Paused",
            congrat:
              "Congratulations new winners, {winners}! You won **{this.prize}**.\n{this.messageURL}",
            error: "Reroll cancelled, no valid participations.",
          },
          lastChance: {
            enabled: false,
            content: contentmain,
            threshold: 60000000000_000,
            embedColor: "#FF0000",
          },
        });
      else if (!channel)
        client.giveawayManager.start(interaction.channel, {
          prize,
          winnerCount,
          duration,
          hostedBy: interaction.user,
          privateMessageInformation: true,
          messages: {
            replyToGiveaway: true,
            giveaway: "🎉 **GIVEAWAY** 🎉",
            giveawayEnded: "🎉 **GIVEAWAY ENDED** 🎉",
            title: "Prize: {this.prize}",
            drawing: "Ends {timestamp}",
            dropMessage: "Be the first, and react to 🎉!",
            inviteToParticipate: "React with 🎉 to enter the giveaway!",
            winMessage: "Congratulations, {winners}! You won **{this.prize}**.\n{this.messageURL}",
            embedFooter: "{this.winnerCount} winners",
            noWinner: "Giveaway cancelled, no valid participations.",
            hostedBy: "Hosted by {this.hostedBy}",
            winners: "Winners:",
            endedAt: "Ended",
            paused: "⚠️ This giveaway is paused!",
            infiniteDurationText: "Paused",
            congrat:
              "Congratulations new winners, {winners}! You won **{this.prize}**.\n{this.messageURL}",
            error: "Reroll cancelled, no valid participations.",
          },
          lastChance: {
            enabled: true,
            content: contentmain,
            threshold: 60000000000_000,
            embedColor: "#FF0000",
          },
        });
      else if (!contentmain)
        client.giveawayManager.start(channel, {
          prize,
          winnerCount,
          duration,
          hostedBy: interaction.user,
          privateMessageInformation: true,
          messages: {
            replyToGiveaway: true,
            giveaway: "🎉 **GIVEAWAY** 🎉",
            giveawayEnded: "🎉 **GIVEAWAY ENDED** 🎉",
            title: "Prize: {this.prize}",
            drawing: "Ends {timestamp}",
            dropMessage: "Be the first, and react to 🎉!",
            inviteToParticipate: "React with 🎉 to enter the giveaway!",
            winMessage: "Congratulations, {winners}! You won **{this.prize}**.\n{this.messageURL}",
            embedFooter: "{this.winnerCount} winners",
            noWinner: "Giveaway cancelled, no valid participations.",
            hostedBy: "Hosted by {this.hostedBy}",
            winners: "Winners:",
            endedAt: "Ended",
            paused: "⚠️ This giveaway is paused!",
            infiniteDurationText: "Paused",
            congrat:
              "Congratulations new winners, {winners}! You won **{this.prize}**.\n{this.messageURL}",
            error: "Reroll cancelled, no valid participations.",
          },
          lastChance: {
            enabled: false,
            content: contentmain,
            threshold: 60000000000_000,
            embedColor: "#FF0000",
          },
        });
      else
        client.giveawayManager.start(channel, {
          prize,
          winnerCount,
          duration,
          hostedBy: interaction.user,
          privateMessageInformation: true,
          messages: {
            replyToGiveaway: true,
            giveaway: "🎉 **GIVEAWAY** 🎉",
            giveawayEnded: "🎉 **GIVEAWAY ENDED** 🎉",
            title: "Prize: {this.prize}",
            drawing: "Ends {timestamp}",
            dropMessage: "Be the first, and react to 🎉!",
            inviteToParticipate: "React with 🎉 to enter the giveaway!",
            winMessage: "Congratulations, {winners}! You won **{this.prize}**.\n{this.messageURL}",
              embedFooter: "{this.winnerCount} winners",
              noWinner: "Giveaway cancelled, no valid participations.",
              hostedBy: "Hosted by {this.hostedBy}",
              winners: "Winners:",
              endedAt: "Ended",
              paused: "⚠️ This giveaway is paused!",
              infiniteDurationText: "Paused",
              congrat:
                "Congratulations new winners, {winners}! You won **{this.prize}**.\n{this.messageURL}",
              error: "Reroll cancelled, no valid participations.",
            },
            lastChance: {
              enabled: true,
              content: contentmain,
              threshold: 60000000000_000,
              embedColor: "#FF0000",
            },
        });

      const embed = new EmbedBuilder()
        .setColor(`Green`)
        .setDescription(
          `<:check:1082334169197187153> Giveaway has been started in ${
            channel || interaction.channel
          }.`
        );

      interaction.editReply({ embeds: [embed], ephemeral: true });
    }

    if (subcommand === "edit") {
      if (!mongoose.connect) await interaction.reply(`no Mongodb Url Provided`);
      const newprize = interaction.options.getString("prize");
      const newduration = interaction.options.getString("time");
      const newwinners = interaction.options.getInteger("winners");
      const messageId = interaction.options.getString("message_id");
      client.giveawayManager
        .edit(messageId, {
          addTime: ms(newduration),
          newWinnerCount: newwinners,
          newPrize: newprize,
        })
        .then(() => {
          interaction.reply("Success! Giveaway updated!");
        })
        .catch((err) => {
          interaction.reply(
            `An error has occurred, please check and try again.\n\`${err}\``
          );
        });
    }

    if (subcommand === "end") {
      const messageId = interaction.options.getString("message_id");
      client.giveawayManager
        .end(messageId)
        .then(() => {
          interaction.reply("Success! Giveaway ended!");
        })
        .catch((err) => {
          interaction.reply(
            `An error has occurred, please check and try again.\n\`${err}\``
          );
        });
    }

    if (subcommand === "reroll") {
      const query = interaction.options.getString("message_id");
      const giveaway =
        client.giveawayManager.giveaways.find(
          (g) => g.guildId === interaction.guildId && g.prize === query
        ) ||
        client.giveawayManager.giveaways.find(
          (g) => g.guildId === interaction.guildId && g.messageId === query
        );

      if (!giveaway)
        return interaction.reply(`Unable to find a giveaway for \`${query}\`.`);
      const messageId = interaction.options.getString("message_id");
      client.giveawayManager
        .reroll(messageId)
        .then(() => {
          interaction.reply("Success! Giveaway rerolled!");
        })
        .catch((err) => {
          interaction.reply(
            `An error has occurred, please check and try again.\n\`${err}\``
          );
        });
    }
  },
};
