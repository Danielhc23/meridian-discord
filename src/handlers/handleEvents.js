const fs = require("node:fs");
const path = require("node:path");

function handleEvents(client){
    //Handle Events
    const eventsFolderPath = path.join(__dirname, "/../events");
    const jsFiles = fs
        .readdirSync(eventsFolderPath)
        .filter((file) => file.endsWith(".js"));

    //Look in event folder for events
    for (const file of jsFiles) {
        const filePath = path.join(eventsFolderPath, file);
        const event = require(filePath);
        if ("name" in event && "execute" in event) {
            if (event.once)
                client.once(event.name, (...args) => event.execute(...args));
            else client.on(event.name, (...args) => event.execute(...args));
        } else {
            console.log(
                `[WARNING] The event at ${filePath} is missing a required "name" or "execute" property.`
            );
        }
    }
}
module.exports = { handleEvents }