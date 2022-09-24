import { ButtonInteraction, CommandInteraction, ContextMenuCommandInteraction, VoiceBasedChannel } from 'discord.js';
import { findPlatforms, manageMusic } from '../modules/music';

export default {
	name: 'music',
	run: async (interaction: any, client: any) => {

		//@ts-ignore
		await interaction.deferReply({ ephemeral: interaction?.options?.getString('visibility') == `everyone` ? false : true });
		
		//@ts-ignore
		if (interaction?.targetMessage?.content || interaction?.options?.getSubcommand() == `platforms`) {
			//@ts-ignore
			let text = interaction?.targetMessage?.content || interaction?.options?.getString('search');
			let data = await findPlatforms(text);
	
			let interactionMessage = await interaction.editReply({
				content: data?.success ? null : `No music platforms found!`,
				components: data?.success ? [{ type: 1, components: data.buttons }, { type: 1, components: [{ type: 2, style: 1, label: `Play in Voice Channel`, emoji: `<:icons_play:861852632800952320>`, custom_id: `play_song` }] }] : []
			});

			let click: any = await interactionMessage?.awaitMessageComponent({
                filter: (inter: any) => {
					let voiceChannel: VoiceBasedChannel = inter?.member?.voice?.channel, permsCheck: boolean = false;
					if (voiceChannel) permsCheck = inter?.guild?.members?.me?.permissionsIn(voiceChannel?.id)?.has(['Connect', 'Speak']);

					if (!voiceChannel) { 
						inter.reply({
							content: `You need to be in a voice channel to use this button!`,
							ephemeral: true
						});
					} else if (!permsCheck) {
						inter.reply({
							content: `I need to have \`Connect\` and \`Speak\` permissions in your voice channel to use this button!`,
							ephemeral: true
						});
					};
							
					return voiceChannel != null && permsCheck == true;
				},
                time: 600000
            }).catch(() => null);

            if (!click) {
				interaction?.editReply({
					components: data?.success ? [{ type: 1, components: data.buttons }, { type: 1, components: [{ type: 2, style: 4, label: `Play in Voice Channel`, emoji: `<:icons_play:861852632800952320>`, custom_id: `play_song`, disabled: true }] }] : []
				}).catch(() => null);
			} else {
				interaction?.editReply({
					components: data?.success ? [{ type: 1, components: data.buttons }, { type: 1, components: [{ type: 2, style: 4, label: `Currently Playing`, emoji: `<:icons_play:861852632800952320>`, custom_id: `play_song`, disabled: true }] }] : []
				}).catch(() => null);
				
				await playSong(interaction, client, data, click);
			};
			
			await click?.deferUpdate().catch(() => null);

			//@ts-ignore
		} else if (interaction?.options?.getSubcommand() == `play`) managePlayer(client, interaction, `play`);
		else if (interaction?.options?.getSubcommand() == `queue`) managePlayer(client, interaction, `queue`);
		else if (interaction?.options?.getSubcommand() == `loop`) managePlayer(client, interaction, `loop`);
		else if (interaction?.options?.getSubcommand() == `stop`) managePlayer(client, interaction, `stop`);
		else if (interaction?.options?.getSubcommand() == `pause`) managePlayer(client, interaction, `pause`);
		else if (interaction?.options?.getSubcommand() == `resume`) managePlayer(client, interaction, `pause`);
		else if (interaction?.options?.getSubcommand() == `replay`) managePlayer(client, interaction, `replay`);
		else if (interaction?.options?.getSubcommand() == `shuffle`) managePlayer(client, interaction, `shuffle`);
		else if (interaction?.options?.getSubcommand() == `previous`) managePlayer(client, interaction, `previous`);
		else if (interaction?.options?.getSubcommand() == `seek`) managePlayer(client, interaction, `seek`, interaction?.options?.getString(`time`) ?? 0);
		else if (interaction?.options?.getSubcommand() == `skip`) managePlayer(client, interaction, `skip`, interaction?.options?.getNumber(`position`) ?? 1);
		else if (interaction?.options?.getSubcommand() == `volume`) managePlayer(client, interaction, `volume`, interaction?.options?.getNumber(`volume`) ?? 70);
	},
};

async function playSong(interaction: any, client: any, data: any, click: any) {
	let voiceChannelId: string = click?.member?.voice?.channel?.id || interaction?.member?.voice?.channel?.id;
	let textChannelId: string = click?.channel?.id || interaction?.channel?.id;
	let message: any, oldMessageId: string = client.players.messages[voiceChannelId]; 

	if (oldMessageId) message = interaction?.channel?.messages?.cache?.get(oldMessageId);
	if (!message?.id) message = await interaction?.channel?.send({
		content: `Loading Player..`,
	});

	let res = await client.manager.search(data?.raw ? data?.raw : data?.buttons?.find((x: any) => {
		return x?.label?.toLowerCase() == `youtube` || x?.label?.toLowerCase() == `spotify` || x?.label?.toLowerCase() == `soundcloud`;
	})?.url, click?.member?.user || interaction?.user);

	client.players.list[voiceChannelId] = client.manager.create({
		guild: interaction?.guild.id,
		voiceChannel: voiceChannelId,
		textChannel: textChannelId,
		selfDeafen: true
	});

	if (client.players.list[voiceChannelId]?.state != "CONNECTED") await client.players.list[voiceChannelId].connect(); client.players.list[voiceChannelId].setVolume(70);
	if (!client.players.messages[voiceChannelId]) client.players.messages[voiceChannelId] = message.id;

	switch (res.loadType) {
		case "NO_MATCHES": {
			message.edit({
				content: `No tracks found!`,
			}).catch(() => null);

			break;
		};
		case "TRACK_LOADED": {
			client.players.list[voiceChannelId].queue.add(res?.tracks[0]);
			if (!client.players.list[voiceChannelId].playing) await client.players.list[voiceChannelId].play(); break;
		};
		case "SEARCH_RESULT": {
			client.players.list[voiceChannelId].queue.add(res?.tracks[0]);
			if (!client.players.list[voiceChannelId].playing) await client.players.list[voiceChannelId].play(); break;
		};
		case "PLAYLIST_LOADED": {
			client.players.list[voiceChannelId].queue.add(res?.tracks);
			if (!client.players.list[voiceChannelId].playing) await client.players.list[voiceChannelId].play(); break;
		};
		case "LOAD_FAILED": {
			client.players.list[voiceChannelId].destroy();

			message.edit({
				content: `An error while searching occured (load failed)!`,
			}).catch(() => null);

			break;
		};
		default: {
			client.players.list[voiceChannelId].destroy();

			message.edit({
				content: `An internal error occured!`,
			}).catch(() => null);

			break;
		};
	};
};

async function managePlayer(client: any, interaction: CommandInteraction | ButtonInteraction | ContextMenuCommandInteraction | any, action: (`seek` | `pause` | `skip` | `previous` | `loop` | `shuffle` | `queue` | `volume` | `stop` | `play` | `replay`), volume?: number) {
	let voiceChannel: VoiceBasedChannel = (interaction as any)?.member?.voice?.channel;

	if (!voiceChannel) {
		interaction.editReply({
			content: `You need to be in a voice channel to use this button!`,
		}).catch(() => null);
	} else if (action == `play`) {
		interaction?.editReply({
			content: `You can now dismiss this message!`,
		}).catch(() => null);

		playSong(interaction, client, { raw: interaction?.options?.getString(`search`) }, null);
	} else {
		let player = client.players.list[voiceChannel?.id];

		if (!player) return interaction.editReply({ content: `There is no music playing in this channel!`, ephemeral: true }).catch(() => null);
		else if (interaction?.member?.voice?.channel?.id != player?.voiceChannel) return interaction.editReply({ content: `You must be in the same voice channel as the bot to use this button!`, ephemeral: true }).catch(() => null);
		else {
			interaction?.editReply({
				content: action == `volume` ? `Volume set to ${volume}%` : action == `pause` ? `Paused / resumed the music!` : action == `shuffle` ? `Shuffled the queue!` : action == `previous` ? `Playing the previous song, if any!` : action == `stop` ? `Stopped the music!` : action == `loop` ? `Looped the queue!` : action == `skip` ? `Skipped the current song!` : action == `queue` ? `Here is the queue!` : `An error occured!`,
			}).catch(() => null);
			
			manageMusic(client, interaction, player, action, action == `seek` ? client.parseTime(volume) : volume);
		};
	};
};