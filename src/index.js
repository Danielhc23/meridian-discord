require("dotenv").config();
const { Client, GatewayIntentBits} = require("discord.js");
const { handleCommands } = require('./handlers/handleCommands.js');
const { handleEvents } = require('./handlers/handleEvents.js');
const token = process.env.MERIDIAN_TOKEN;

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
