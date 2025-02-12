const { REST, Routes } = require("discord.js");
const guildClient = process.env.TESTING_SERVER_CLIENT; //Use for local guild command register
const botClient = process.env.MERIDIAN_CLIENT;
const token = process.env.MERIDIAN_TOKEN;

async function addCommands(commands) {
    const rest = new REST().setToken(token);
    try {
        console.log(
            `Registering ${commands.length} application slash commands.`
        );

        const data = await rest.put(Routes.applicationCommands(botClient), {
            body: commands,
        });
        console.log(
            `Successfully registered ${commands.length} application slash commands.`
        );
    } catch (error) {
        console.log(error);
    }
}

module.exports = { addCommands };
