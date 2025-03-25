const { Events } = require("discord.js");
const { pause, unPause, skip, disconnect } = require("../mp3/index.js");
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(
                interaction.commandName
            );
            if (!command) {
                console.error(
                    `No command matching ${interaction.commandName} was found.`
                );
                return;
            }

            try {
                //Call command
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
            }
        } else if (interaction.isAutocomplete()) {
            const command = interaction.client.commands.get(
                interaction.commandName
            );
            if (!command) {
                console.error(
                    `No command matching ${interaction.commandName} was found.`
                );
                return;
            }

            try {
                //Call command
                await command.autocomplete(interaction);
            } catch (error) {
                console.error(error);
            }
        } else if (interaction.isButton()) {
            const message = interaction.message;
            switch (interaction.customId) {
                case "pause": {
                    pause(interaction);
                    break;
                }
                case "unPause": {
                    unPause(interaction);
                    break;
                }
                case "skip": {
                    skip(interaction);
                    break;
                }
                case "disconnect": {
                    disconnect(interaction);
                    break;
                }
            }
        }
    },
};
