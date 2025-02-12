const { SlashCommandBuilder } = require("discord.js");
const {playerSkip} = require('../../mp3/index')
module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip track. Will start song from the beginning."),

    async execute(interaction) {
        playerSkip();
        await interaction.reply("Song is now skiped.");
    },
};
