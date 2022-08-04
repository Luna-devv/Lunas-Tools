import { Presence } from 'discord.js';

export default {
    name: 'presenceUpdate',
    run: async (oldRpc: Presence, newRpc: Presence, client: any) => {

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