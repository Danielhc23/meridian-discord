const { spawn } = require("child_process");
const {
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    getVoiceConnection,
    AudioPlayerStatus,
} = require("@discordjs/voice");
const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    EmbedBuilder,
} = require("discord.js");
const { handlePlayerEvents } = require("../handlers/handlePlayerEvents");
const { handleVoiceEvents } = require("../handlers/handleVoiceEvents");
const baseUrl = "https://www.youtube.com/watch?v=";
const { TrackData } = require("../utils/trackData.js");
const Queue = require("queue-fifo");

const pauseButton = new ButtonBuilder()
    .setCustomId("pause")
    .setStyle(ButtonStyle.Secondary)
    .setEmoji("⏸️");

const unpauseButton = new ButtonBuilder()
    .setCustomId("unPause")
    .setStyle(ButtonStyle.Primary)
    .setEmoji("▶️");

const skipButton = new ButtonBuilder()
    .setCustomId("skip")
    .setStyle(ButtonStyle.Secondary)
    .setEmoji("⏯️");

const disconnectButton = new ButtonBuilder()
    .setCustomId("disconnect")
    .setStyle(ButtonStyle.Secondary)
    .setEmoji("❌");

/**
 * @var {Queue<TrackData>}
 */
const queue = new Queue();

let currentPlayer;
let currentConnection;
let currentInteraction;
let currentMessage;

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

function pause(interaction) {
    currentPlayer.pause();
    const message = interaction.message;
    const buttons = new ActionRowBuilder().addComponents(
        unpauseButton,
        skipButton,
        disconnectButton
    );
    message.edit({ components: [buttons] });
}

function unPause(interaction) {
    currentPlayer.unpause();
    const message = interaction.message;
    const buttons = new ActionRowBuilder().addComponents(
        pauseButton,
        skipButton,
        disconnectButton
    );
    message.edit({ components: [buttons] });
}

function skip(interaction) {
    if (isEmpty()) {
        const embed = new EmbedBuilder()
        .setTitle("Queue Empty.")
        .setColor("#fffeb0")
        
    message.edit({ embeds: [embed] });
    } else {
        dequeue();
    }
}

function disconnect(interaction) {
    const embed = new EmbedBuilder()
    .setTitle("Queue Empty.")
    .setColor("#fffeb0")
    
    message.edit({ embeds: [embed] });
    
    deletePlayer() && currentConnection.destroy() && queue.clear();
}

/**
 *
 * @param {TrackData} track
 */
function enqueue(track, interaction) {
    currentInteraction = interaction;
    if (queue.isEmpty() && !currentPlayer) {
        //1. Play first song - when queue is empty and player does not exist
        queue.enqueue(track);
        console.log(`Enqueued track: ${track.name} - ${track.id}`);
        currentPlayer = createAudioPlayer();
        handlePlayerEvents(currentPlayer);
        dequeue();
    } else {
        queue.enqueue(track);
        console.log(`Enqueued track: ${track.name} - ${track.id}`);
    }
}

function dequeue() {
    const track = queue.dequeue();
    console.log(`Dequeued track: ${track.name} - ${track.id}`);
    const resource = createAudioResource(fetchYoutubeAudio(track.id));
    currentPlayer.play(resource);
    currentConnection.subscribe(currentPlayer);
    displayTrack(track);
}

function isEmpty() {
    return queue.isEmpty();
}

function deletePlayer() {
    currentPlayer.stop();
    console.log(currentPlayer);
}

async function displayTrack(track) {

    const row = new ActionRowBuilder().addComponents(
        pauseButton,
        skipButton,
        disconnectButton
    );
    //console.log(currentInteraction);

    const embed = new EmbedBuilder()
        .setTitle("Now Playing: " + track.name)
        .setThumbnail(track.thumbnail)
        .setColor("#fffeb0")
        .setURL(baseUrl + track.id);

    console.log(currentInteraction);
    const currentMessage = await currentInteraction.channel.send({
        components: [row],
        embeds: [embed],
    });
}

function nextMessage() {
    if (isEmpty()) {
        currentMessage.edit({
            components: [],
            embeds: [],
        });
    }
}

/**
 *
 * @param {string} videoId
 */
function fetchYoutubeAudio(videoId) {
    const yt_dlp = spawn("yt-dlp", [
        "-f",
        "bestaudio",
        "-o",
        "-",
        baseUrl + videoId,
    ]);
    return yt_dlp.stdout;
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
    nextMessage,
    deletePlayer
};
