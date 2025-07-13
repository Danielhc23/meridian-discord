const { AudioPlayerError } = require('@discordjs/voice');

module.exports = {
    name: AudioPlayerError,
    execute(error){
        console.log(error);
    }
}