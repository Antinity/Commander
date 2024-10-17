const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add")
    .setDMPermission(false)
    .setDescription("Add emoji, stickers and soundboard sounds to your server.")
    .addSubcommand((command) =>
      command
        .setName("emoji")
        .setDescription("Add an emoji to your server.")
        .addAttachmentOption((option) =>
          option
            .setName("emoji")
            .setDescription("Select your emoji file.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription(`Specify the name of the emoji.`)
            .setRequired(true)
            .setMinLength(2)
            .setMaxLength(30)
        )
    )
    .addSubcommand((command) =>
      command
        .setName("sticker")
        .setDescription("Add a sticker to your server.")
        .addAttachmentOption((option) =>
          option
            .setName("sticker")
            .setDescription("Select your PNG/JPEG sticker file.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription(`Specify the name of the sticker.`)
            .setRequired(true)
            .setMinLength(2)
            .setMaxLength(30)
        )
    )
    .addSubcommand((command) =>
      command
        .setName("soundboard")
        .setDescription("Add a soundboard sound to your server.")
        .addAttachmentOption((option) =>
          option
            .setName("sound")
            .setDescription("Select your MP3 soundboard audio file.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription(`Specify the name of the sound.`)
            .setRequired(true)
            .setMinLength(2)
            .setMaxLength(30)
        )
    )
    .setDMPermission(false),
  async execute(interaction) {
    const errEmbed = new EmbedBuilder()
      .setColor(`Red`)
      .setDescription(
        `<:cross:1082334173915775046> You are not allowed to perform this action.`
      );

    if (
      !interaction.member.permissions.has(
        PermissionFlagsBits.ManageEmojisAndStickers
      ) &&
      interaction.user.id !== process.env.DeveloperID.split(',')
    )
      return await interaction.reply({ embeds: [errEmbed], ephemeral: true });

    const sub = interaction.options.getSubcommand();

    switch (sub) {
      case "emoji":
        const emojiname = interaction.options.getString("name");
        const emojiupload = interaction.options.getAttachment("emoji");
        const loadingEmbed = new EmbedBuilder()
          .setColor(`Green`)
          .setDescription(
            `<a:loading:1097897188882915338> Adding ${emojiname} emoji...`
          );
        await interaction.reply({ embeds: [loadingEmbed] });
        const emoji = await interaction.guild.emojis
          .create({
            name: `${emojiname}`,
            attachment: `${emojiupload.attachment}`,
          })
          .catch((err) => {
            setTimeout(() => {
              const errEmbed = new EmbedBuilder()
                .setColor(`Red`)
                .setDescription(
                  `<:cross:1082334173915775046> Unable to upload **${emojiname}**.\n> ${err.rawError.message}`
                );
              return interaction.editReply({ embeds: [errEmbed] });
            }, 2000);
          });

        setTimeout(() => {
          if (!emoji) return;

          const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(
              `<:check:1082334169197187153> Sucessfully added ${emoji} emoji as **${emojiname}**.`
            );

          interaction.editReply({ embeds: [embed] });
        }, 3000);

        break;
      case "sticker":
        const stickerupload = interaction.options.getAttachment("sticker");
        const name = interaction.options.getString("name");

        const gif = new EmbedBuilder()
          .setColor(`Red`)
          .setDescription(
            `<:cross:1082334173915775046> You can only upload png/apng sticker files.`
          );

        if (stickerupload.contentType === "Image/gif")
          return await interaction.reply({ embeds: [gif], ephemeral: true });

        const loadingEmbed1 = new EmbedBuilder()
          .setColor(`Green`)
          .setDescription(
            `<a:loading:1097897188882915338> Adding **${name}** sticker...`
          );

        await interaction.reply({ embeds: [loadingEmbed1] });

        const sticker = await interaction.guild.stickers
          .create({
            file: `${stickerupload.attachment}`,
            name: `${name}`,
          })
          .catch((err) => {
            setTimeout(() => {
              const errEmbed = new EmbedBuilder()
                .setColor(`Red`)
                .setDescription(
                  `<:cross:1082334173915775046> Unable to upload **${name}** sticker.\n> ${err.rawError.message}`
                );
              return interaction.editReply({ embeds: [errEmbed] });
            }, 2000);
          });

          const embed = new EmbedBuilder()
          .setColor("Green")
          .setDescription(
            `<:check:1082334169197187153> Sucessfully added sticker as **${name}**.`
          );

        setTimeout(() => {
          if (!sticker) return;

          interaction.editReply({ embeds: [embed] });
        }, 3000);

        break;
      case "soundboard":
        const sound = await interaction.options.getAttachment("sound");
        const soundname = await interaction.options.getString("name");

        const nonMp3 = new EmbedBuilder()
        .setColor(`Red`)
        .setDescription(
          `<:cross:1082334173915775046> You can only upload MP3 soundboard files.`
        );

        if (sound.contentType !== "audio/mpeg")
        
          return await interaction.reply({
            embeds: [nonMp3],
            ephemeral: true,
          });
          
          const loadingEmbed2 = new EmbedBuilder()
          .setColor(`Green`)
          .setDescription(
            `<a:loading:1097897188882915338> Adding **${soundname}** sound to soundboard...`
          );

        await interaction.reply({
          embeds: [loadingEmbed2],
        });

        const uploadsound = await interaction.guild.soundboard
          .create({
            file: `${sound.attachment}`,
            name: `${soundname}`,
          })
          .catch((err) => {
            setTimeout(() => {
                const errEmbed = new EmbedBuilder()
                .setColor(`Red`)
                .setDescription(
                  `<:cross:1082334173915775046> Unable to upload **${soundname}** soundboard.\n> ${err.rawError.message}`
                );
              return interaction.editReply({ embeds: [errEmbed] });
            }, 2000);
          });

          const sucess = new EmbedBuilder()
          .setColor("Green")
          .setDescription(
            `<:check:1082334169197187153> Sucessfully added soundboard sound as **${soundname}**.`
          );

        setTimeout(() => {
          if (!uploadsound) return;
          else {
            interaction.editReply({ embeds: [sucess] });
          }
        }, 3000);
    }
  },
};
