const { SlashCommandBuilder } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");
const { unPause } = require('../../mp3/index');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unpause")
        .setDescription(
            "Unpause track. Bot will leave after 15 minutes if not playing."
        ),

    async execute(interaction) {
        const connection = getVoiceConnection(interaction.guildId);
        if (connection){
            unPause();
            await interaction.reply("Track is now unpaused.");
        } else {
            await interaction.reply("Bot is not in a channel")
        }
    },
};
