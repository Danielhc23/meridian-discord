const { AudioPlayerError } = require('@discordjs/voice');


module.exports = {
    name: 'error',
    execute(error){
        console.log(error);
    }
}