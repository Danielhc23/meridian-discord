const { VoiceConnectionStatus } = require('@discordjs/voice');



module.exports = {
    name: VoiceConnectionStatus.Connecting,
    async execute(oldState, newState, connection){
        console.log("Connecting");
    }
}