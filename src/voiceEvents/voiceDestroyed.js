const { VoiceConnectionStatus } = require('@discordjs/voice');

module.exports = {
    name: VoiceConnectionStatus.Destroyed,
    async execute(oldState, newState, connection){
        //console.log("Destroyed");
    }
}