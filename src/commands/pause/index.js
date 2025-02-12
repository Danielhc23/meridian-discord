const { SlashCommandBuilder } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");
const { pause } = require('../../mp3/index');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription(
            "Pause track. Bot will leave after 15 minutes if not playing."
        ),

    async execute(interaction) {
        const connection = getVoiceConnection(interaction.guildId);
        if (connection){
            pause();
            await interaction.reply("Track is now paused.");
        } else {
            await interaction.reply("Bot is not in a channel")
        }
    },
};
