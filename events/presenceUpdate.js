module.exports = {
    name: 'presenceUpdate',
    run: async (oldRpc, newRpc) => {
        const client = newRpc.client;

        // copy my user status
        if (newRpc?.userId != `821472922140803112`) return;
        if (newRpc?.status != client.lastStatus)
            client.user.setPresence({
                status: newRpc?.status,
                activities: [{
                    name: `at waya.one`,
                    type: `WATCHING`,
                }]
            });

    }
};