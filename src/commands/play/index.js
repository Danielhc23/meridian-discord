const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { voiceChannelMembers } = require("../../events/voiceStates.js");
const { fetchResults } = require("../../tracks");
const { enqueue, createNewConnection } = require("../../mp3/index.js");
const TrackData = require("../../utils/trackData.js");
const baseUrl = "https://www.youtube.com/watch?v=";

let autoCompleteCache = new Map();

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
        const channel =
            voiceChannelMembers.get(interaction.member) ||
            interaction.member.voice.channel;

        if (!channel) {
            const noChannel = new EmbedBuilder()
                .setDescription("Join a voice channel before playing a track.")
                .setColor("#ff0000");

            await interaction.reply({ embeds: [noChannel] });
            return;
        }

        const track = autoCompleteCache.get(
            interaction.options.getString("query")
        ) || autoCompleteCache.values().next().value;

        if (!track) {
            const noTrack = new EmbedBuilder()
                .setDescription("Please choose from the provided list.")
                .setColor("#ff0000");

            await interaction.reply({ embeds: [noTrack] });
            return;
        }

        createNewConnection(channel, interaction);
        enqueue(track, interaction);

        const embedTrack = new EmbedBuilder()
            .setDescription("Added " + track.name)
            .setThumbnail(track.thumbnail)
            .setColor("#fffeb0")
            .setURL(baseUrl + track.id);

        //console.log(embedTrack);
        await interaction.reply({ embeds: [embedTrack] });
    },
    async autocomplete(interaction) {
        const focusedVal = interaction.options.getFocused().trim();
        console.log("Input: ", focusedVal);

        if (focusedVal.length <= 0) {
            await interaction.respond([]);
            return;
        }

        autoCompleteCache = await fetchResults(focusedVal, 5);

        if (autoCompleteCache.size <= 0) {
            await interaction.respond([]);
            return;
        }

        console.log("Cache: ", autoCompleteCache);

        try {
            await interaction.respond(
                Array.from(autoCompleteCache, ([key, value]) => {
                    return {
                        name: value.name.slice(0, 99),
                        value: key.toString(),
                    };
                })
            );
        } catch (error) {
            console.error(error);
            await interaction.respond([]);
        }
    },
};
