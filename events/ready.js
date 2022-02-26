const { end } = require(`../functions/logger`);

module.exports = {
    name: 'ready',
    once: true,
    run: async (client) => {

        // copy my user status
        const user = await client.users.fetch(`821472922140803112`);
        client.user.setPresence({ status: user?.status });
        client.lastStatus = user?.status;
        end(`App`, `Connected as ${client.user.tag}`, `blue`);

    }
};