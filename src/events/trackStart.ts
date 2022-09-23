import { getComponents } from '../modules/music';

export default {
	name: 'trackStart',
	erela: true,

    run: async (client: any, player: any, track: any) => {
		const componentsList = getComponents(player);

		client.channels.cache.get(player.textChannel)?.messages.cache.get(client.players.messages[(player as any).voiceChannel])?.edit({
	    	content: '',
			components: componentsList,
	    	embeds: [
	    		{
	    			color: 15447957,
	    			image: {
						url: `https://cdn.crni.xyz/r/invisible.png`
					},
					description: `> Currently playing [${track?.title?.length > 40 ? `${track?.title?.slice(0, 40)}..` : track?.title}](${track?.uri}).\n> It's duration is ${track?.isStream ? `infinite` : `${client.formatTime(track?.duration)}`}.`,
					footer: {
						text: `Started by ${player?.queue?.current?.requester?.tag}`,
						iconURL: player?.queue?.current?.requester?.displayAvatarURL()
					}
	    		}
	    	],
	    }).catch(() => {
			client.channels.cache.get(player.textChannel)?.send({
				content: '',
				components: componentsList,
				embeds: [
					{
						color: 15447957,
						image: {
							url: `https://cdn.crni.xyz/r/invisible.png`
						},
						description: `> Currently playing [${track?.title?.length > 40 ? `${track?.title?.slice(0, 40)}..` : track?.title}](${track?.uri}).\n> It's duration is ${track?.isStream ? `infinite` : `${client.formatTime(track?.duration)}`}.`,
						footer: {
							text: `Started by ${player?.queue?.current?.requester?.tag}`,
							iconURL: player?.queue?.current?.requester?.displayAvatarURL()
						}
					}
				],
			}).catch(() => null);
		});
    }
};