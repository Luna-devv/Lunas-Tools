import { getComponents } from '../modules/music';

export default {
	name: 'trackStart',
	erela: true,

    run: async (client: any, player: any, track: any) => {
		let oldMessage = client.channels.cache.get(player.textChannel)?.messages.cache.get(client.players.messages[(player as any).voiceChannel]);
		let messageChannel = client.channels.cache.get(player.textChannel);

		let feildList: { name: string, value: string, inline: boolean }[] = [{
			name: `• Currently Playing`,
			value: `> ${track?.title}`,
			inline: false
		}, {
			name: `• Ends`,
			value: `> ${track?.isStream ? `In Far Future` : `<t:${Math.round((new Date().getTime() / 1000) + (175000 / 1000))}:R>`}`,
			inline: true
		}, {
			name: `• Source`,
			value: `> [Click Here](${track?.uri})`,
			inline: true
		}];

		// if (player?.queue?.size > 0) {
		// 	feildList.push({
		// 		name: `• Next Up`,
		// 		value: `> ${player?.queue?.[0]?.title}`,
		// 		inline: false
		// 	});
		// };

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
						fields: feildList,
						footer: oldMessage?.embeds?.[0]?.footer || {
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
							fields: feildList,
							footer: oldMessage?.embeds?.[0]?.footer || {
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
						fields: feildList,
						footer: oldMessage?.embeds?.[0]?.footer || {
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