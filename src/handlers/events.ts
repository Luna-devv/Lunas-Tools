import { EventType } from '../json/typings';
import { readdirSync } from'fs';

export default (client: any) => {
    const eventFiles: string[] = readdirSync('./events').filter((file: string) => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event: EventType = require(`../events/${file}`);
        const argumentsFunction = (...args: any[]) => event.run(...args);
        event.once ? client.once(event.name, argumentsFunction) : client.on(event.name, argumentsFunction);
    };
};