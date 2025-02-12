const { SlashCommandBuilder } = require("discord.js");
const { voiceChannelMembers } = require("../../events/voiceStates.js");
const { enqueue, createNewConnection } = require('../../mp3/index.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("idplay")
        .setDescription("Give track Id, it will play automatically or be added to queue.")
        .addStringOption((option) =>
            option
                .setName("id")
                .setDescription("Youtube Id of the track")
                .setRequired(true)
        ),

    async execute(interaction) {
        const fetchNewestChannelPackage = voiceChannelMembers.get(
            interaction.member
        );
        const channel =
            voiceChannelMembers.get(interaction.member) ||
            interaction.member.voice.channel;

        if (channel) {
            createNewConnection(channel, interaction);
            enqueue(interaction.options.getString("id"));

            await interaction.reply("Now playing");

        } else {
            await interaction.reply(
                "Join a voice channel before playing a track."
            );
        }
    },
};
