const { end } = require(`../functions/logger`);

module.exports = {
    name: 'ready',
    once: true,
    run: async (client) => {

        await ['828676951023550495', '810248284861366332'].forEach((guild) => client.guilds.cache.get(guild)?.commands.set([]).catch(() => null)); // test guilds
        await client.application.commands.set(require('../interactionsData.js')); // all guilds

        // copy my user status
        const user = await client.users.fetch(`821472922140803112`);
        client.user.setPresence({ status: user?.status });
        client.lastStatus = user?.status;
        end(`App`, `Connected as ${client.user.tag}`, `blue`);

    }
};