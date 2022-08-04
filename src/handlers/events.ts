const {
    readdirSync
} = require('fs');

module.exports = (client) => {
    const eventFiles = readdirSync('./events').filter((file) => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(`../events/${file}`);
        const argumentsFunction = (...args) => event.run(...args);
        event.once ? client.once(event.name, argumentsFunction) : client.on(event.name, argumentsFunction);
    };
};