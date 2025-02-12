const { Events } = require("discord.js");



const voiceChannelMembers = new Map();

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState) {
        if (newState.channelId) {
            voiceChannelMembers.set(
                newState.member,
                newState.channel
            );
        } else {
            voiceChannelMembers.delete(newState.member);
        }
    },
    voiceChannelMembers,
};
