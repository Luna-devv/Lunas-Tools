import { getComponents } from '../modules/music';

export default {
	name: 'trackStart',
	erela: true,

    run: async (client: any, player: any, track: any) => {
		let oldMessage = client.channels.cache.get(player.textChannel)?.messages.cache.get(client.players.messages[(player as any).voiceChannel]);
		let messageChannel = client.channels.cache.get(player.textChannel);

		if (messageChannel?.lastMessageId === oldMessage?.id) {
			oldMessage?.edit({
				content: '',
				components: getComponents(player),
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
			}).catch(async () => {
				oldMessage?.delete().catch(() => null);

				let message = await client.channels.cache.get(player.textChannel)?.send({
					content: '',
					components: getComponents(player),
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

				client.players.messages[(player as any).voiceChannel] = message?.id;
			});
		} else {
			oldMessage?.delete().catch(() => null);

			let message = await client.channels.cache.get(player.textChannel)?.send({
				content: '',
				components: getComponents(player),
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

			client.players.messages[(player as any).voiceChannel] = message?.id;
		};
    }
};