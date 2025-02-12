const env = require("dotenv").config();
const token = process.env.MERIDIAN_TOKEN;
const { Client, GatewayIntentBits} = require("discord.js");
const { registerCommands } = require("./registration/registerCommands.js");
const { handleCommands } = require('./handlers/handleCommands.js');
const { handleEvents } = require('./handlers/handleEvents.js');
const { handleVoiceEvents } = require('./handlers/handleVoiceEvents.js');

const bot = "Meridian";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

handleCommands(client);
handleEvents(client);

client.login(token);
