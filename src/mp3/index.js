const {
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    getVoiceConnection,
    AudioPlayer,
    VoiceConnection,
    AudioPlayerStatus
} = require("@discordjs/voice");
const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    CommandInteraction,
    VoiceChannel,
    ButtonInteraction,
} = require("discord.js");
const { handlePlayerEvents } = require("../handlers/handlePlayerEvents");
const { handleVoiceEvents } = require("../handlers/handleVoiceEvents");
const baseUrl = "https://www.youtube.com/watch?v=";
const { TrackData } = require("../utils/trackData.js");
const Queue = require("queue-fifo");
const { fetchTrackAudio } = require("../api/fetchTrackAudio.js");
const { primaryColor } = require("../utils/colors.js");


/**
 * @type {ButtonBuilder}
 */
const pauseButton = new ButtonBuilder()
    .setCustomId("pause")
    .setStyle(ButtonStyle.Secondary)
    .setEmoji("⏸️");

/**
 * @type {ButtonBuilder}
 */
const unpauseButton = new ButtonBuilder()
    .setCustomId("unPause")
    .setStyle(ButtonStyle.Primary)
    .setEmoji("▶️");

/**
 * @type {ButtonBuilder}
 */
const skipButton = new ButtonBuilder()
    .setCustomId("skip")
    .setStyle(ButtonStyle.Secondary)
    .setEmoji("⏯️");

/**
 * @type {ButtonBuilder}
 */
const disconnectButton = new ButtonBuilder()
    .setCustomId("disconnect")
    .setStyle(ButtonStyle.Secondary)
    .setEmoji("❌");

/**
 * @type {Queue<TrackData>}
 */
const queue = new Queue();

/**
 * @type {AudioPlayer}
 */
let currentPlayer;

/**
 * @type {VoiceConnection}
 */
let currentConnection;

/**
 * @type {CommandInteraction}
 */
let currentInteraction;

/**
 * Creates a new voice connection on call from play command
 * @param {VoiceChannel} channel The voice channel to connect to
 * @param {CommandInteraction} interaction The interaction that triggered this
 */
function createNewConnection(channel, interaction) {
    if (!getVoiceConnection(interaction.guildId)) {
        currentConnection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });
        handleVoiceEvents(currentConnection);
    }
}

/**
 * Pauses the current audio player and updates the message with the pause button
 * @param {ButtonInteraction} interaction The interaction that triggered this
 */
function pause(interaction) {
    currentPlayer.pause();
    const buttons = new ActionRowBuilder().addComponents(
        unpauseButton,
        skipButton,
        disconnectButton
    );
    interaction.update({ components: [buttons] });
}

/**
 * Unpauses the current audio player and updates the message with the play button
 * @param {ButtonInteraction} interaction The interaction that triggered this
 */
function unPause(interaction) {
    currentPlayer.unpause();
    const buttons = new ActionRowBuilder().addComponents(
        pauseButton,
        skipButton,
        disconnectButton
    );
    interaction.update({ components: [buttons] });
}

/**
 * Skips the current track and updates the message with the skip button
 * @param {ButtonInteraction} interaction The interaction that triggered this
 */
function skip(interaction) {
    if (isEmpty()) {
        const embed = new EmbedBuilder()
            .setDescription("Queue Empty.")
            .setColor(primaryColor);

        deletePlayer();
        interaction.update({ embeds: [embed], components: [] });
    } else {
        dequeue();
    }
}

/**
 * Disconnects from voice and cleans up resources
 * @param {ButtonInteraction} interaction The interaction that triggered this
 */
function disconnect(interaction) {
    const embed = new EmbedBuilder()
        .setDescription("Disconnected.")
        .setColor(primaryColor);

    interaction.update({ embeds: [embed], components: [] });
    deletePlayer() && currentConnection.destroy() && queue.clear();
}

/**
 * Enqueues a track and starts playback if nothing is currently playing
 * @param {TrackData} track The track data to enqueue
 * @param {CommandInteraction} interaction The interaction that triggered this
 */
async function enqueue(track, interaction) {
    const embed = new EmbedBuilder()
    .setDescription("Added " + track.name)
    .setThumbnail(track.thumbnail)
    .setColor(primaryColor)
    .setURL(baseUrl + track.id);

    //Use global var to store interaction || Bundle track with interaction.
    //Global Vars are less intutive than bundling
    currentInteraction = interaction;

    if (!currentPlayer || currentPlayer.state === AudioPlayerStatus.Idle) {
        //1. Create a new audio player if it doesn't exist
        currentPlayer = createAudioPlayer();
        handlePlayerEvents(currentPlayer);
    }

    if (queue.isEmpty()) {
        //2. Automatically play first song when queue is empty
        queue.enqueue(track);
        console.log(`Enqueued track: ${track.name} - ${track.id}`);
        dequeue();
    } else {
        //2. Add song to queue when something is playing
        queue.enqueue(track);
        console.log(`Enqueued track: ${track.name} - ${track.id}`);
    }

    await interaction.reply({ embeds: [embed] });
}

/**
 * Removes and plays the next track from the queue
 */
function dequeue() {
    const track = queue.dequeue();
    console.log(`Dequeued track: ${track.name} - ${track.id}`);
    const resource = createAudioResource(fetchTrackAudio(track.id));
    currentPlayer.play(resource);
    currentConnection.subscribe(currentPlayer);
    displayTrack(track);
}

/**
 * Checks if the queue is empty
 * @returns {boolean} True if queue is empty, false otherwise
 */
function isEmpty() {
    return queue.isEmpty();
}

/**
 * Deletes the current player
 */
function deletePlayer() {
    currentPlayer.stop();
}

function displayTrack(track) {
    const row = new ActionRowBuilder().addComponents(
        pauseButton,
        skipButton,
        disconnectButton
    );

    const embed = new EmbedBuilder()
        .setTitle("Now Playing: " + track.name)
        .setThumbnail(track.thumbnail)
        .setColor(primaryColor)
        .setURL(baseUrl + track.id);

    currentInteraction.channel.send({
        components: [row],
        embeds: [embed],
    });
}



module.exports = {
    enqueue,
    dequeue,
    isEmpty,
    skip,
    createNewConnection,
    disconnect,
    pause,
    unPause,
    deletePlayer,
};
