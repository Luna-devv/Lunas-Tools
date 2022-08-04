import { Presence } from 'discord.js';

export default {
    name: 'presenceUpdate',
    run: async (client: any, oldRpc: Presence, newRpc: Presence) => {

        // copy Luna's user status
        if (newRpc?.userId != `821472922140803112`) return;
        if (newRpc?.status != client?.lastStatus) {
            client?.user?.setPresence({
                status: newRpc?.status,
                activities: [{
                    name: `at waya.one`,
                    type: `WATCHING`,
                }]
            } as any);
        };
    }
};