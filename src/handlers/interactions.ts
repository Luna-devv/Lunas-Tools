const { readdirSync } = require('fs');

module.exports = (client) => {
    const commands = readdirSync('./interactions/commands/').filter(
        (file) => file.endsWith('.js')
    );

    for (let file of commands) {
        let pull = require(`../interactions/commands/${file}`);

        if (pull.name) {
            client.interactions.set(pull.name, pull);
        };
    };

};