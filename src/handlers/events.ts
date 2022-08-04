import path from 'path';
import fs from 'fs';

export default function (client: any) {
    const eventFiles = fs.readdirSync(path.join(__dirname, `..`, `events`)).filter((file: any) => file.endsWith(".js"));

    for (const file of eventFiles) {
        const event = require(path.join(__dirname, `..`, `events`, file)).default;
        
        const argumentsFunction = (...args: any) => event.run(client, ...args);
        event.once ? client.once(event.name, argumentsFunction) : client.on(event.name, argumentsFunction);
    };
};