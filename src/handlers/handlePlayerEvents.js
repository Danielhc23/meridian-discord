const fs = require("node:fs");
const path = require("node:path");

function handlePlayerEvents(player){
    //Handle voiceEvents
    const eventsFolderPath = path.join(__dirname, "/../playerEvents");
    const jsFiles = fs
        .readdirSync(eventsFolderPath)
        .filter((file) => file.endsWith(".js"));

    //Look in voiceEvent folder for voiceEvents
    for (const file of jsFiles) {
        const filePath = path.join(eventsFolderPath, file);
        const event = require(filePath);
        if ("name" in event && "execute" in event) {
            if (event.once)
                player.once(event.name, (...args) => event.execute(...args));
            else player.on(event.name, (...args) => event.execute(...args));
        } else {
            console.log(
                `[WARNING] The event at ${filePath} is missing a required "name" or "execute" property.`
            );
        }
    }
}
module.exports = { handlePlayerEvents }