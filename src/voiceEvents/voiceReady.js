const { VoiceConnectionStatus } = require('@discordjs/voice');
const { createNewPlayer, size} = require('../mp3/index.js')



module.exports = {
    name: VoiceConnectionStatus.Ready,
    async execute(oldState, newState, connection){
        console.log("Ready");
    }
}