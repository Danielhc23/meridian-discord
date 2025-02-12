const { AudioPlayerStatus } = require('@discordjs/voice');
const { dequeue, size} = require('../mp3/index.js')


module.exports = {
    name: AudioPlayerStatus.Idle,
    execute(oldState, newState){
        console.log('Player Idle');
        if (size() > 0) {
            console.log('Player Idle');
            dequeue();
        }
    }
}