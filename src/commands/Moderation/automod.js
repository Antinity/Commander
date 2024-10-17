const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("automod")
    .setDMPermission(false)
    .setDescription("Setup and create automod rules for your server.")
    .addSubcommand((command) =>
      command
        .setName("flagged-words")
        .setDescription("Block profanity, specific content, and slurs.")
    )
    .addSubcommand((command) =>
      command
        .setName("spam-messages")
        .setDescription("Stops likely detected as spam messages.")
    )
    .addSubcommand((command) =>
      command
        .setName("mention-spam")
        .setDescription(
          "Stops members from spamming mentions/pings in a single message.."
        )
        .addIntegerOption((option) =>
          option
            .setName("number")
            .setDescription(
              "Specify the maximum amount of mentions/pings allowed in a single message."
            )
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command
        .setName("keyword")
        .setDescription("Block a specified word in the server.")
        .addStringOption((option) =>
          option
            .setName("word")
            .setDescription("Specify the word to block.")
            .setRequired(true)
        )
    ),

  async execute(interaction, client) {
    const { guild, options } = interaction;
    const sub = options.getSubcommand();

    if (
      !interaction.member.permissions.has(PermissionFlagsBits.Administrator) &&
      interaction.user.id !== process.env.DeveloperID.split(',')
    ) {
      const PermissionEmbed = new EmbedBuilder()
        .setColor(`Red`)
        .setDescription(
          `<:cross:1082334173915775046> You are not allowed to perform this action.`
        );
      return await interaction.reply({
        embeds: [PermissionEmbed],
        ephemeral: true,
      });
    }

    const loading = new EmbedBuilder()
      .setColor("Green")
      .setDescription(
        `<a:loading:1097897188882915338> Adding the **automod rule**..`
      );

    switch (sub) {
      case "flagged-words":
        await interaction.reply({ embeds: [loading] });

        const rule = await guild.autoModerationRules
          .create({
            name: `Block profinity and inappropriate content by ${client.user.username}.`,
            creatorId: process.env.ClientID,
            enabled: true,
            eventType: 1,
            triggerType: 4,
            triggerMetadata: {
              presets: [1, 2, 3],
            },
            actions: [
              {
                type: 1,
                metadata: {
                  channel: interaction.channel,
                  durationSeconds: 10,
                  customMessage: `Please don't use very strong and inappropriate language.`,
                },
              },
            ],
          })
          .catch(async (err) => {
            setTimeout(async () => {
              return await interaction.editReply({ content: `${err}` });
            }, 2000);
          });

        setTimeout(async () => {
          if (!rule) return;

          const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(
              `<:check:1082334169197187153> Automod rule added for flagged words.`
            );

          await interaction.editReply({
            embeds: [embed],
          });
        }, 3000);

        break;

      case "keyword":
        await interaction.reply({ embeds: [loading] });
        const word = options.getString("word");

        const rule2 = await guild.autoModerationRules
          .create({
            name: `Block the word "${word}" by ${client.user.username}.`,
            creatorId: process.env.ClientID,
            enabled: true,
            eventType: 1,
            triggerType: 1,
            triggerMetadata: {
              keywordFilter: [`${word}`],
            },
            actions: [
              {
                type: 1,
                metadata: {
                  channel: interaction.channel,
                  durationSeconds: 10,
                  customMessage: `You can't say "${word}" because it is blocked by the admins.`,
                },
              },
            ],
          })
          .catch(async (err) => {
            setTimeout(async () => {
              return await interaction.editReply({ content: `${err}` });
            }, 2000);
          });

        setTimeout(async () => {
          if (!rule2) return;

          const wordembed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(
              `<:check:1082334169197187153> Automod rule added for the word "${word}" word.`
            );

          await interaction.editReply({
            content: ``,
            embeds: [wordembed],
          });
        }, 3000);

        break;

      case "spam-messages":
        await interaction.reply({ embeds: [loading] });

        const rule3 = await guild.autoModerationRules
          .create({
            name: `Prevent spam messages by ${client.user.username}.`,
            creatorId: process.env.ClientID,
            enabled: true,
            eventType: 1,
            triggerType: 5,
            triggerMetadata: {
              mentionTotalLimit: 3,
            },
            actions: [
              {
                type: 1,
                metadata: {
                  channel: interaction.channel,
                  durationSeconds: 10,
                  customMessage: "You are not allowed send spam messages.",
                },
              },
            ],
          })
          .catch(async (err) => {
            setTimeout(async () => {
              return await interaction.editReply({ content: `${err}` });
            }, 2000);
          });

        setTimeout(async () => {
          if (!rule3) return;

          const spamembed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(
              `<:check:1082334169197187153> Automod rule added for spam messages.`
            );

          await interaction.editReply({
            embeds: [spamembed],
          });
        }, 3000);

        break;

      case "mention-spam":
        await interaction.reply({ embeds: [loading] });
        const number = options.getInteger("number");

        const rule4 = await guild.autoModerationRules
          .create({
            name: `Prevent excess mentions by ${client.user.username}.`,
            creatorId: process.env.ClientID,
            enabled: true,
            eventType: 1,
            triggerType: 5,
            triggerMetadata: {
              mentionTotalLimit: number,
            },
            actions: [
              {
                type: 1,
                metadata: {
                  channel: interaction.channel,
                  durationSeconds: 2,
                  customMessage:
                    "You exceeded the maximum mention limit for this message.",
                },
              },
            ],
          })
          .catch(async (err) => {
            setTimeout(async () => {
              return await interaction.editReply({ content: `${err}` });
            }, 2000);
          });

        setTimeout(async () => {
          if (!rule4) return;

          const mentionembed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(
              `<:check:1082334169197187153> Automod rule added for spam mentions.`
            );

          await interaction.editReply({
            embeds: [mentionembed],
          });
        }, 3000);

        break;
    }
  },
};
