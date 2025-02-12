const fs = require("node:fs");
const path = require("node:path");

function handleVoiceEvents(connection){
    //Handle voiceEvents
    const eventsFolderPath = path.join(__dirname, "/../voiceEvents");
    const jsFiles = fs
        .readdirSync(eventsFolderPath)
        .filter((file) => file.endsWith(".js"));

    //Look in voiceEvent folder for voiceEvents
    for (const file of jsFiles) {
        const filePath = path.join(eventsFolderPath, file);
        const event = require(filePath);
        if ("name" in event && "execute" in event) {
            if (event.once)
                connection.once(event.name, (...args) => event.execute(...args, connection));
            else connection.on(event.name, (...args) => event.execute(...args, connection));
        } else {
            console.log(
                `[WARNING] The event at ${filePath} is missing a required "name" or "execute" property.`
            );
        }
    }
}
module.exports = { handleVoiceEvents }