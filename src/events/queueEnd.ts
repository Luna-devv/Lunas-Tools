import { Player } from 'erela.js';
import { getComponents } from '../modules/music';

export default {
	name: 'queueEnd',
	erela: true,

    run: async (client: any, player: Player) => {
        let channel = client.channels.cache.get(player.textChannel);
        let message = channel?.messages.cache.get(client.players.messages[(player as any).voiceChannel]);

        if (message?.id) { 
            await message?.edit({
                content: '',
                embeds: [
                    {
                        color: 15447957,
                        image: {
                            url: `https://cdn.crni.xyz/r/invisible.png`
                        },
                        description: `> Queue has ended, use the button below to start playing again.`,
                    }
                ],
                components: getComponents(player, true),
            }).catch(() => null);
        } else {
            await channel?.send({
                content: '',
                embeds: [
                    {
                        color: 15447957,
                        image: {
                            url: `https://cdn.crni.xyz/r/invisible.png`
                        },
                        description: `> Queue has ended, use the button below to start playing again.`,
                    }
                ],
                components: getComponents(player, true),
            }).catch(() => null);
        };
        
        client.players.list[(player as any).voiceChannel]?.destroy();
    }
};