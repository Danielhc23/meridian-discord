const { Events } = require("discord.js");
const { registerCommands } = require("../registration/registerCommands.js");
const bot = "Meridian";

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(bot + " is now online.");
        registerCommands();
    },
};
