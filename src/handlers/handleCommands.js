const fs = require("node:fs");
const path = require("node:path");
const { Collection } = require("discord.js");

function handleCommands(client){
    client.commands = new Collection();

    const commandsFolderPath = path.join(__dirname, "/../commands");
    const commandsFolder = fs.readdirSync(commandsFolderPath);
    //Look in commands folder for command folders
    for (const commandFolder of commandsFolder) {
        const commandFolderPath = path.join(commandsFolderPath, commandFolder);
        const jsFiles = fs
            .readdirSync(commandFolderPath)
            .filter((file) => file.endsWith(".js"));
        for (const file of jsFiles) {
            const filePath = path.join(commandFolderPath, file);
            const command = require(filePath);
            if ("data" in command && "execute" in command) {
                client.commands.set(command.data.name, command);
            } else {
                console.log(
                    `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
                );
            }
        }
    }
}

module.exports = { handleCommands }