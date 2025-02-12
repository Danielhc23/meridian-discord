const { SlashCommandBuilder } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");
const { disconnect } = require('../../mp3/index.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("disconnect")
        .setDescription("Remove bot from channel."),

    async execute(interaction) {
        const connection = getVoiceConnection(interaction.guildId);
        if (connection) {
            disconnect();
            await interaction.reply("Bot has left channel.");
        } else {
            await interaction.reply("Bot is not in a channel");
        }
    },
};
