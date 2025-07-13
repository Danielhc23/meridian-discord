const { VoiceConnectionStatus } = require('@discordjs/voice');

module.exports = {
    name: VoiceConnectionStatus.Disconnected,
    async execute(oldState, newState, connection){
       console.log("Disconnected");
    }
}