const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rewind")
        .setDescription("Rewind track. Will start song from the beginning."),

    async execute(interaction) {
        await interaction.reply("Song is now rewinded.");
    },
};
