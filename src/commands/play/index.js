const { SlashCommandBuilder } = require("discord.js");
const { voiceChannelMembers } = require("../../events/voiceStates.js");
const { fetchResults } = require("../../tracks");
const { enqueue, createNewConnection } = require("../../mp3/index.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription(
            "Search for track, it will play automatically or be added to queue."
        )
        .addStringOption((option) =>
            option
                .setName("query")
                .setDescription("Name of track")
                .setRequired(true)
                .setAutocomplete(true)
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
            enqueue(interaction.options.getString("query"));

            await interaction.reply("Now playing");
        } else {
            await interaction.reply(
                "Join a voice channel before playing a track."
            );
        }
    },
    async autocomplete(interaction) {
        const focusedVal = interaction.options.getFocused().trim();
        console.log(focusedVal);
        if (focusedVal.length > 0) {
            const choices = await fetchResults(focusedVal, 5);
            if (choices.length <= 0) {
                await interaction.respond([]);
            }

            console.log(choices);
            let titles = [];
            let ids = [];

            choices.forEach((value, key) => {
                ids.push(value[0]);
                titles.push(`${value[1]} - ${key}`);
            });

            titles = titles.map((str) =>
                str.length > 100 ? str.slice(0, 100) : str
            );
            await interaction.respond(
                titles.map((title, i) => ({ name: title, value: ids[i] }))
            );
        } else {
            await interaction.respond([]);
        }
    },
};
