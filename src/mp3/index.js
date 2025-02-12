const { spawn } = require("child_process");
const {createAudioPlayer, createAudioResource, joinVoiceChannel, getVoiceConnection, AudioPlayerStatus} = require("@discordjs/voice");
const { handlePlayerEvents } = require('../handlers/handlePlayerEvents');
const { handleVoiceEvents } = require('../handlers/handleVoiceEvents');
const baseUrl = "https://www.youtube.com/watch?v=";

let queue = [];
let player;
let currentConnection;
let resource;

function createNewConnection(channel, interaction){
    if (!getVoiceConnection(interaction.guildId))
    {
        currentConnection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });
        handleVoiceEvents(currentConnection);
    }
}

function disconnect(){
    player.stop();
    currentConnection.destroy();
    reset();
}

function pause(){
    player.pause();
}

function unPause(){
    player.unpause();
}

function enqueue(videoId) {
    queue.push(videoId);
    console.log('enqueue', queue);

}


function dequeue() {
    console.log('dequeue', queue);
    const track = queue.splice(0,1).toString();
    resource = createAudioResource(fetchYoutubeAudio(track));
    player.play(resource);
    currentConnection.subscribe(player);
}

function playerSkip(){
    return player.stop();
}

function size(){
    return queue.length;
}

function createNewPlayer() {
    player = createAudioPlayer();
    handlePlayerEvents(player)
    dequeue();
}

function reset(){
    queue = [];
}

/**
 *
 * @param {string} videoId
 */
function fetchYoutubeAudio(videoId) {
    const yt_dlp = spawn("yt-dlp", ['-f','bestaudio',"-o", "-", baseUrl + videoId]);
    return yt_dlp.stdout
}

module.exports = { enqueue, dequeue, size, playerSkip, createNewPlayer, createNewConnection, disconnect, pause, unPause};
