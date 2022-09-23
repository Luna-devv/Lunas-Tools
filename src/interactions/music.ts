import { volumeSet, pauseSong, skipSong, previousSong, loopToggle, shuffleToggle, queue, volumeSong } from '../modules/music';
import { VoiceBasedChannel } from 'discord.js';
import { findPlatforms } from '../modules/music';

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
				});
			} else {
				interaction?.editReply({
					components: data?.success ? [{ type: 1, components: data.buttons }, { type: 1, components: [{ type: 2, style: 4, label: `Currently Playing`, emoji: `<:icons_play:861852632800952320>`, custom_id: `play_song`, disabled: true }] }] : []
				});
				
				await playSong(interaction, client, data, click, true);
			};
			
			await click?.deferUpdate().catch(() => null);

			//@ts-ignore
		} else if (interaction?.options?.getSubcommand() == `play`) {
			let voiceChannel: VoiceBasedChannel = (interaction as any)?.member?.voice?.channel, permsCheck: boolean = false;
			if (voiceChannel) permsCheck = (interaction as any)?.guild?.members?.me?.permissionsIn(voiceChannel?.id)?.has(['Connect', 'Speak']);

			if (!voiceChannel) {
				interaction.editReply({
					content: `You need to be in a voice channel to use this button!`,
				});
			} else if (!permsCheck) {
				interaction.editReply({
					content: `I need to have \`Connect\` and \`Speak\` permissions in your voice channel to use this button!`,
				});
			} else {
				interaction?.editReply({
					content: `You can dismiss this message now!`,
				});

				//@ts-ignore
				await playSong(interaction, client, { raw: interaction?.options?.getString(`search`) }, null, false);
			};

			//@ts-ignore
		} else if (interaction?.options?.getSubcommand() == `skip`) {
			let voiceChannel: VoiceBasedChannel = (interaction as any)?.member?.voice?.channel;

			if (!voiceChannel) {
				interaction.editReply({
					content: `You need to be in a voice channel to use this button!`,
				});
			} else {
				let player = client.players.list[voiceChannel?.id];

				if (!player) return interaction.editReply({ content: `There is no music playing in this channel!`, ephemeral: true });
				else if (interaction?.member?.voice?.channel?.id !== player?.voiceChannel) return interaction.reply({ content: `> You must be in the same voice channel as the bot to use this button!`, ephemeral: true });
				else {
					interaction?.editReply({
						content: `Music has been shuffled!`,
					});

					skipSong(client, interaction, player);
				};
			};

			//@ts-ignore
		} else if (interaction?.options?.getSubcommand() == `previous`) {
			let voiceChannel: VoiceBasedChannel = (interaction as any)?.member?.voice?.channel;

			if (!voiceChannel) {
				interaction.editReply({
					content: `You need to be in a voice channel to use this button!`,
				});
			} else {
				let player = client.players.list[voiceChannel?.id];

				if (!player) return interaction.editReply({ content: `There is no music playing in this channel!`, ephemeral: true });
				else if (interaction?.member?.voice?.channel?.id !== player?.voiceChannel) return interaction.reply({ content: `> You must be in the same voice channel as the bot to use this button!`, ephemeral: true });
				else {
					interaction?.editReply({
						content: `Music has been shuffled!`,
					});

					previousSong(client, interaction, player);
				};
			};

			//@ts-ignore
		} else if (interaction?.options?.getSubcommand() == `queue`) {
			let voiceChannel: VoiceBasedChannel = (interaction as any)?.member?.voice?.channel;

			if (!voiceChannel) {
				interaction.editReply({
					content: `You need to be in a voice channel to use this button!`,
				});
			} else {
				let player = client.players.list[voiceChannel?.id];

				if (!player) return interaction.editReply({ content: `There is no music playing in this channel!`, ephemeral: true });
				else if (interaction?.member?.voice?.channel?.id !== player?.voiceChannel) return interaction.reply({ content: `> You must be in the same voice channel as the bot to use this button!`, ephemeral: true });
				else {
					queue(client, interaction, player);
				};
			};

			//@ts-ignore
		} else if (interaction?.options?.getSubcommand() == `loop`) {
			let voiceChannel: VoiceBasedChannel = (interaction as any)?.member?.voice?.channel;

			if (!voiceChannel) {
				interaction.editReply({
					content: `You need to be in a voice channel to use this button!`,
				});
			} else {
				let player = client.players.list[voiceChannel?.id];

				if (!player) return interaction.editReply({ content: `There is no music playing in this channel!`, ephemeral: true });
				else if (interaction?.member?.voice?.channel?.id !== player?.voiceChannel) return interaction.reply({ content: `> You must be in the same voice channel as the bot to use this button!`, ephemeral: true });
				else {
					interaction?.editReply({
						content: `Looping is now ${player?.loop ? `enabled` : `disabled`}!`,
					});

					loopToggle(client, interaction, player);
				};
			};

			//@ts-ignore
		} else if (interaction?.options?.getSubcommand() == `shuffle`) {
			let voiceChannel: VoiceBasedChannel = (interaction as any)?.member?.voice?.channel;

			if (!voiceChannel) {
				interaction.editReply({
					content: `You need to be in a voice channel to use this button!`,
				});
			} else {
				let player = client.players.list[voiceChannel?.id];

				if (!player) return interaction.editReply({ content: `There is no music playing in this channel!`, ephemeral: true });
				else if (interaction?.member?.voice?.channel?.id !== player?.voiceChannel) return interaction.reply({ content: `> You must be in the same voice channel as the bot to use this button!`, ephemeral: true });
				else {
					interaction?.editReply({
						content: `Music has been shuffled!`,
					});

					shuffleToggle(client, interaction, player);
				};
			};

			//@ts-ignore
		} else if (interaction?.options?.getSubcommand() == `resume`) {
			let voiceChannel: VoiceBasedChannel = (interaction as any)?.member?.voice?.channel;

			if (!voiceChannel) {
				interaction.editReply({
					content: `You need to be in a voice channel to use this button!`,
				});
			} else {
				let player = client.players.list[voiceChannel?.id];

				if (!player) return interaction.editReply({ content: `There is no music playing in this channel!`, ephemeral: true });
				else if (interaction?.member?.voice?.channel?.id !== player?.voiceChannel) return interaction.reply({ content: `> You must be in the same voice channel as the bot to use this button!`, ephemeral: true });
				else {
					interaction?.editReply({
						content: `Music has been resumed / paused!`,
					});

					pauseSong(client, interaction, player);
				};
			};

			//@ts-ignore
		} else if (interaction?.options?.getSubcommand() == `pause`) {
			let voiceChannel: VoiceBasedChannel = (interaction as any)?.member?.voice?.channel;

			if (!voiceChannel) {
				interaction.editReply({
					content: `You need to be in a voice channel to use this button!`,
				});
			} else {
				let player = client.players.list[voiceChannel?.id];

				if (!player) return interaction.editReply({ content: `There is no music playing in this channel!`, ephemeral: true });
				else if (interaction?.member?.voice?.channel?.id !== player?.voiceChannel) return interaction.reply({ content: `> You must be in the same voice channel as the bot to use this button!`, ephemeral: true });
				else {
					interaction?.editReply({
						content: `Music has been resumed / paused!`,
					});

					pauseSong(client, interaction, player);
				};
			};

			//@ts-ignore
		} else if (interaction?.options?.getSubcommand() == `stop`) {
			let voiceChannel: VoiceBasedChannel = (interaction as any)?.member?.voice?.channel;

			if (!voiceChannel) {
				interaction.editReply({
					content: `You need to be in a voice channel to use this button!`,
				});
			} else {
				let player = client.players.list[voiceChannel?.id];

				if (!player) return interaction.editReply({ content: `There is no music playing in this channel!`, ephemeral: true });
				else if (interaction?.member?.voice?.channel?.id !== player?.voiceChannel) return interaction.reply({ content: `> You must be in the same voice channel as the bot to use this button!`, ephemeral: true });
				else {
					interaction?.editReply({
						content: `Music has been stopped!`,
					});

					player.destroy();
				};
			};

			//@ts-ignore
		} else if (interaction?.options?.getSubcommand() == `volume`) {
			let voiceChannel: VoiceBasedChannel = (interaction as any)?.member?.voice?.channel;

			if (!voiceChannel) {
				interaction.editReply({
					content: `You need to be in a voice channel to use this button!`,
				});
			} else {
				let player = client.players.list[voiceChannel?.id];

				if (!player) return interaction.editReply({ content: `There is no music playing in this channel!`, ephemeral: true });
				else if (interaction?.member?.voice?.channel?.id !== player?.voiceChannel) return interaction.reply({ content: `> You must be in the same voice channel as the bot to use this button!`, ephemeral: true });
				else {
					interaction?.editReply({
						content: `Volume has been changed!`,
					});

					volumeSong(client, interaction, player, interaction?.options?.getNumber(`volume`));
				};
			};

			//@ts-ignore
		};
	},
};

async function playSong(interaction: any, client: any, data: any, click: any, defer: boolean) {
	let voiceChannelId: string = click?.member?.voice?.channel?.id || interaction?.member?.voice?.channel?.id;
	let textChannelId: string = click?.channel?.id || interaction?.channel?.id;
	let message: any; 

	if (client.players.messages[voiceChannelId]) message = interaction?.channel?.messages?.cache?.get(client.players.messages[voiceChannelId]);
	if (!message) message = await interaction?.channel?.send({
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

	switch (res.loadType) {
		case "NO_MATCHES": {
			message.edit({
				content: `No tracks found!`,
			}).catch(() => null);

			break;
		};
		case "TRACK_LOADED": {
			client.players.list[voiceChannelId].queue.add(res?.tracks[0]);
			client.players.messages[voiceChannelId] = message?.id;

			if (!client.players.list[voiceChannelId].playing) await client.players.list[voiceChannelId].play(); break;
		};
		case "SEARCH_RESULT": {
			client.players.list[voiceChannelId].queue.add(res?.tracks[0]);
			client.players.messages[voiceChannelId] = message?.id;

			if (!client.players.list[voiceChannelId].playing) await client.players.list[voiceChannelId].play(); break;
		};
		case "PLAYLIST_LOADED": {
			client.players.list[voiceChannelId].queue.add(res?.tracks);
			client.players.messages[voiceChannelId] = message?.id;

			if (!client.players.list[voiceChannelId].playing) await client.players.list[voiceChannelId].play(); break;
		};
		case "LOAD_FAILED": {
			client.players.list[voiceChannelId].destroy();
			delete client.players.messages[voiceChannelId];

			message.edit({
				content: `An error while searching occured (load failed)!`,
			}).catch(() => null);

			break;
		};
		default: {
			client.players.list[voiceChannelId].destroy();
			delete client.players.messages[voiceChannelId];

			message.edit({
				content: `An internal error occured!`,
			}).catch(() => null);

			break;
		};
	};
};