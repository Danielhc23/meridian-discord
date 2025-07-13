const { Events } = require("discord.js");
const { searchPlayers } = require("../mp3/index.js");

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
            const id = interaction.customId;
            const player = searchPlayers(interaction.guildId);
            
            switch (id) {
                case "pause": {
                    player.pause(interaction);
                    break;
                }
                case "unPause": {
                    player.unPause(interaction);
                    break;
                }
                case "skip": {
                    player.skip(interaction);
                    break;
                }
                case "disconnect": {
                    player.disconnect(interaction);
                    break;
                }
            }
        }
    },
};
