const { AudioPlayerStatus } = require("@discordjs/voice");
const { deletePlayer } = require("../mp3/index.js");

module.exports = {
    name: AudioPlayerStatus.Idle,
    execute(oldState, newState, player) {
        console.log("Player Idle");
        if (!player.queue.isEmpty()) {
            player.dequeue();
        } else {
            player.isPlaying = false;
            player.displayEnd();
        }
    },
};
