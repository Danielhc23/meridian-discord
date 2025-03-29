const { VoiceConnectionStatus } = require('@discordjs/voice');

module.exports = {
    name: VoiceConnectionStatus.Ready,
    async execute(oldState, newState, connection){
        //console.log("Ready");
    }
}