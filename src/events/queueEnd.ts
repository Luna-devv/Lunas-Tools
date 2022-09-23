import { getComponents } from '../modules/music';

export default {
	name: 'queueEnd',
	erela: true,

    run: async (client: any, player: any) => {
        let oldMessage = client.channels.cache.get(player.textChannel)?.messages.cache.get(client.players.messages[(player as any).voiceChannel]); oldMessage?.delete().catch(() => null);

		let message = await client.channels.cache.get(player.textChannel)?.send({
            content: '',
            embeds: [
                {
                    color: 15447957,
                    image: {
                        url: `https://cdn.crni.xyz/r/invisible.png`
                    },
                    description: `> Queue has ended, to play again, use \`/music play\` to add songs.`,
                }
            ],
            components: getComponents(player, true),
        }).catch(() => null);
        
        client.players.list[(player as any).voiceChannel].destroy();
        client.players.messages[(player as any).voiceChannel] = message?.id;
    }
};