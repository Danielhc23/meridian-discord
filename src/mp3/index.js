const {
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    getVoiceConnection,
    AudioPlayer,
    VoiceConnection,
    AudioPlayerStatus,
} = require("@discordjs/voice");
const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    CommandInteraction,
    VoiceChannel,
    ButtonInteraction,
    Guild,
} = require("discord.js");
const { handlePlayerEvents } = require("../handlers/handlePlayerEvents");
const { handleVoiceEvents } = require("../handlers/handleVoiceEvents");
const baseUrl = "https://www.youtube.com/watch?v=";
const { TrackData } = require("../utils/trackData.js");
const Queue = require("queue-fifo");
const { fetchTrackAudio } = require("../api/fetchTrackAudio.js");
const { primaryColor } = require("../utils/colors.js");

//Constant buttons used for GUI
const pauseButton = new ButtonBuilder()
    .setCustomId(`pause`)
    .setStyle(ButtonStyle.Secondary)
    .setEmoji("⏸️");

const unpauseButton = new ButtonBuilder()
    .setCustomId(`unPause`)
    .setStyle(ButtonStyle.Primary)
    .setEmoji("▶️");

const skipButton = new ButtonBuilder()
    .setCustomId(`skip`)
    .setStyle(ButtonStyle.Secondary)
    .setEmoji("⏯️");

const disconnectButton = new ButtonBuilder()
    .setCustomId(`disconnect`)
    .setStyle(ButtonStyle.Secondary)
    .setEmoji("❌");

    
class Player {
    /**
     *
     * @param {VoiceConnection} voiceConnection
     * @param {AudioPlayer} player
     * @param {CommandInteraction} interaction
     */
    constructor(voiceConnection, interaction) {
        this.voiceConnection = voiceConnection;
        this.player = null;
        this.queue = new Queue();
        this.interaction = interaction;
        this.isPlaying = false; //Used only for enqueue, dequeue loop. IS NOT FALSE WHEN PAUSED
    }

    /**
     * Enqueues a track and starts playback if nothing is currently playing
     * @param {TrackData} track The track data to enqueue
     * @param {CommandInteraction} interaction The interaction that triggered this
     */
    async enqueue(track, interaction) {

        this.interaction = interaction;

        const embed = new EmbedBuilder()
            .setDescription("Added " + track.name)
            .setThumbnail(track.thumbnail)
            .setColor(primaryColor)
            .setURL(baseUrl + track.id);

        this.queue.enqueue(track);
        console.log(`Enqueued track: ${track.name} - ${track.id}`);

        //Enqueue for the first time
        if (!this.isPlaying)
        {
            if (!this.player) {            
                this.player = createAudioPlayer();
                handlePlayerEvents(this);
            }
            this.dequeue();
        }

        await this.interaction.reply({ embeds: [embed] });
    }

    /**
     * Removes and plays the next track from the queue
     * Only call if 100% queue is not empty
     */
    dequeue() {
        const track = this.queue.dequeue();
        console.log(`Dequeued track: ${track.name} - ${track.id}`);
        const resource = createAudioResource(fetchTrackAudio(track.id));
        this.player.play(resource);
        this.voiceConnection.subscribe(this.player);
        this.isPlaying = true;
        this.displayTrack(track);
    }

    /**
     * Pauses the current audio player and updates the message with the pause button
     */
    pause(buttonInteraction) {
        this.player.pause();
        const buttons = new ActionRowBuilder().addComponents(
            unpauseButton,
            skipButton,
            disconnectButton
        );
        buttonInteraction.update({ components: [buttons] });
    }

    /**
     * Unpauses the current audio player and updates the message with the play button
     */
    unPause(buttonInteraction) {
        this.player.unpause();
        const buttons = new ActionRowBuilder().addComponents(
            pauseButton,
            skipButton,
            disconnectButton
        );
        buttonInteraction.update({ components: [buttons] });
    }

    /**
     * Skips the current track and updates the message with the skip button
     * 
     */
    skip(buttonInteraction) {
        if (this.queue.isEmpty()) {
            const embed = new EmbedBuilder()
                .setDescription("Queue Empty.")
                .setColor(primaryColor);

            buttonInteraction.update({ embeds: [embed], components: [] });
        } else {
            this.dequeue();
        }
    }

    /**
     * Disconnects from voice and cleans up resources
     */
    disconnect(buttonInteraction) {
        this.player.stop();
        this.voiceConnection.destroy();
        deletePlayer(this);
        const embed = new EmbedBuilder()
            .setDescription("Disconnected.")
            .setColor(primaryColor);
        
        buttonInteraction.update({ embeds: [embed], components: [] });

    }

    displayTrack(track) {
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

        this.interaction.channel.send({
            components: [row],
            embeds: [embed],
        });
    }

    displayEnd(){
        const embed = new EmbedBuilder()
            .setDescription("Queue Empty.")
            .setColor(primaryColor);

        this.interaction.update({ embeds: [embed], components: [] });
    }
}

/**
 * Each Guild should have only one Player due to discord.js limitation. Map each guild Id (string) to a Player.
 * @type {Map<string, Player>}
 */
const playerMap = new Map();

/**
 * If guild does not have an activate Player: Returns new Player
 * Else: Returns existing Player
 * @param {CommandInteraction} interaction
 * @param {VoiceChannel} channel
 * @returns {Player}
 */
function createNewPlayer(interaction, channel) {
    let player = playerMap.get(interaction.guildId);

    if (!player) {
        const voiceConnection = createNewConnection(channel);
        player = new Player(voiceConnection, interaction);
        playerMap.set(interaction.guildId, player);
    }

    return player;
}

/**
 *
 * @param {string} guildId
 * @returns {Player || undefined}
 */
function searchPlayers(guildId) {
    return playerMap.get(guildId);
}

/**
 *
 * @param {Player} player
 * @returns {Boolean}
 */
function deletePlayer(player) {    
    playerMap.delete(player);
    player = null;
}

/**
 * Creates a new voice connection on call from play command
 * @param {VoiceChannel} channel The voice channel to connect to
 * @param {CommandInteraction} interaction The interaction that triggered this
 */
function createNewConnection(channel) {
    let currentConnection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });
    return currentConnection;
}

module.exports = {
    createNewPlayer,
    searchPlayers,
    deletePlayer,
};
