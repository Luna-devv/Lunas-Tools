import { checkConditions, getComponents } from '../modules/music';
import { playSong } from '../interactions/music';
import { CommandType } from '../json/typings';

export default {
	name: 'interactionCreate',
	run: async (client: any, interaction: any) => {

		if (interaction.isSelectMenu() && interaction.customId?.startsWith('volume_menu_')) checkConditions(client, interaction, 'volume', interaction.customId?.split('_')[2], interaction.values[0]);

		if (interaction.isButton()) {
			if (interaction.customId?.startsWith('play_')) checkConditions(client, interaction, 'play', interaction.customId?.split('_')[1]);
			else if (interaction.customId?.startsWith('pause_')) checkConditions(client, interaction, 'pause', interaction.customId?.split('_')[1]);
			else if (interaction.customId?.startsWith('skip_')) checkConditions(client, interaction, 'skip', interaction.customId?.split('_')[1]);
			else if (interaction.customId?.startsWith('previous_')) checkConditions(client, interaction, 'previous', interaction.customId?.split('_')[1]);
			else if (interaction.customId?.startsWith('queue_')) checkConditions(client, interaction, 'queue', interaction.customId?.split('_')[1]);
			else if (interaction.customId?.startsWith('loop_')) checkConditions(client, interaction, 'loop', interaction.customId?.split('_')[1]);
			else if (interaction.customId?.startsWith('stop_')) checkConditions(client, interaction, 'stop', interaction.customId?.split('_')[1]);
			else if (interaction.customId?.startsWith('shuffle_')) checkConditions(client, interaction, 'shuffle', interaction.customId?.split('_')[1]);
			else if (interaction.customId?.startsWith('replay_')) checkConditions(client, interaction, 'replay', interaction.customId?.split('_')[1]);
			else if (interaction.customId?.startsWith('movedown_')) {
				let player = client.players.list[interaction?.customId?.split('_')[1]];

				if (!player) return interaction.reply({ content: `There is no music playing in this channel!`, ephemeral: true });
				else if (interaction?.member?.voice?.channel?.id !== player?.voiceChannel) return interaction.reply({ content: `You must be in the same voice channel as the bot to use this button!`, ephemeral: true });
				else {
					if (interaction?.channel?.lastMessageId == interaction?.message?.id) return interaction.deferUpdate().catch(() => null);
					await interaction.message.delete().catch(() => null); 
					
					let feildList: { name: string, value: string, inline: boolean }[] = [{
						name: `• Currently Playing`,
						value: `> ${player?.queue?.current?.title}`,
						inline: false
					}, {
						name: `• Ends`,
						value: `> ${player?.queue?.current?.isStream ? `In Far Future` : `<t:${Math.round((new Date().getTime() / 1000) + (175000 / 1000))}:R>`}`,
						inline: true
					}, {
						name: `• Source`,
						value: `> [Click Here](${player?.queue?.current?.uri})`,
						inline: true
					}];
			
					// if (player?.queue?.size > 0) {
					// 	feildList.push({
					// 		name: `• Next Up`,
					// 		value: `> ${player?.queue?.[0]?.title}`,
					// 		inline: false
					// 	});
					// };

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
								footer: {
									text: `Panel moved by ${interaction?.user?.tag}`,
									iconURL: interaction?.user?.displayAvatarURL()
								}
							}
						],
					}).catch(() => null);

					client.players.messages[(player as any).voiceChannel] = message?.id;
				};
			};
		};

		if (interaction.isModalSubmit()) {
			if (interaction.customId?.startsWith('play_modal_')) {
				await interaction.deferReply({ ephemeral: true }).catch(() => null);
				
				let songSomething: string = interaction.fields.getTextInputValue(`song_field`);
				let urlRegex = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/g;
				let test = songSomething.match(urlRegex);
				
				if (!songSomething) return interaction.editReply({ content: `You must provide a song name or link!` });
				
				interaction?.editReply({
					content: `You can now dismiss this message!`,
				}).catch(() => null)

				playSong(interaction, client, { raw: test ? test[0] : songSomething }, null);
			};
		};

		if (interaction.isCommand()) {
			if (interaction.commandName == `Find Music Platforms`) interaction.commandName = `music`;
			const command: CommandType = client.interactions.get(interaction.commandName);

			if (!interaction.guild?.id) return interaction.reply({
				content: `This command can't be used inside Private Messages.`,
				ephemeral: true,
				components: [
					{
						type: 1,
						components: [
							{
								type: 2,
								label: `Invite Waya`,
								style: 5,
								url: `https://waya.one/add`,
							},
						],
					},
				],
			});

			await command.run(interaction, client).catch((error: any) => console.error(error));
		};
	},
};