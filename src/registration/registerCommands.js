require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const { addCommands } = require("./addCommands.js");
const { deleteCommands } = require("./deleteCommands.js");

async function registerCommands() {
  //Register in one server
  commands = [];

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
        commands.push(command.data.toJSON());
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required 'data' or 'execute' property.`
        );
      }
    }
  }

  addCommands(commands);
}

module.exports = { registerCommands };
