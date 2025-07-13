const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { voiceChannelMembers } = require("../../events/voiceStates.js");
const { fetchTrackData } = require("../../api/fetchTrackData.js");
const { createNewPlayer } = require("../../mp3/index.js");
const { errorColor } = require("../../utils/colors.js");

/**
 * Stores tracks to reduce the number of Youtube API calls.
 * Stored data can be incorrect but most likely not an issue since music videos arent usually deleted or modified
 * TODO: Store this in local storage or use a database to add persistence
 * TODO: Prevent deleted videos from appearing in this Cache so maybe refresh frequently or remove entry if data is bad
 * @type {Map<string, TrackData>}
 */
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
                .setColor(errorColor);

            await interaction.reply({ embeds: [noChannel] });
            return;
        }

        const track = autoCompleteCache.get(
            interaction.options.getString("query")
        ) || autoCompleteCache.values().next().value;

        if (!track) {
            const noTrack = new EmbedBuilder()
                .setDescription("Please choose from the provided list.")
                .setColor(errorColor);

            await interaction.reply({ embeds: [noTrack] });
            return;
        }

        const player = createNewPlayer(interaction, channel);
        await player.enqueue(track, interaction);
    },
    async autocomplete(interaction) {
        const focusedVal = interaction.options.getFocused().trim();
        console.log("Input: ", focusedVal);

        if (focusedVal.length <= 0) {
            await interaction.respond([]);
            return;
        }

        autoCompleteCache = await fetchTrackData(focusedVal, 5);

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
