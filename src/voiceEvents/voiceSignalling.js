const { VoiceConnectionStatus } = require('@discordjs/voice');

module.exports = {
    name: VoiceConnectionStatus.Signalling,
    async execute(oldState, newState, connection){
        //console.log("Signalling");
    }
}