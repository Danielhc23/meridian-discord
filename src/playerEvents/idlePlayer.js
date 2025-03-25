const { AudioPlayerStatus } = require("@discordjs/voice");
const { dequeue, isEmpty, deletePlayer } = require("../mp3/index.js");

module.exports = {
    name: AudioPlayerStatus.Idle,
    execute(oldState, newState) {
        console.log("Player Idle");
        if (!isEmpty()) dequeue();
        else {
            deletePlayer();
        }
    },
};
