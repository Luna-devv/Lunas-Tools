import { volumeSet, pauseSong, skipSong, previousSong, loopToggle, shuffleToggle, queue } from '../modules/music';
import { CommandType } from '../json/typings';

export default {
	name: 'interactionCreate',
	run: async (client: any, interaction: any) => {

		if (interaction.isButton()) {
			if (interaction.customId?.startsWith('pause_')) {
				let player = client.players.list[interaction.customId.split('_')[1]];

				if (!player) return interaction.reply({ content: `There is no music playing in this channel!`, ephemeral: true });
				else if (interaction?.member?.voice?.channel?.id !== player?.voiceChannel) return interaction.reply({ content: `> You must be in the same voice channel as the bot to use this button!`, ephemeral: true });
				else {
					interaction.deferUpdate().catch(() => null);
					pauseSong(client, interaction, player);
				};
			};

			if (interaction.customId?.startsWith('skip_')) {
				let player = client.players.list[interaction.customId.split('_')[1]];

				if (!player) return interaction.reply({ content: `There is no music playing in this channel!`, ephemeral: true });
				else if (interaction?.member?.voice?.channel?.id !== player?.voiceChannel) return interaction.reply({ content: `> You must be in the same voice channel as the bot to use this button!`, ephemeral: true });
				else if (!player.queue.current) return interaction.reply({ content: `> There is no song to skip!`, ephemeral: true });
				else {
					interaction.deferUpdate().catch(() => null);
					skipSong(client, interaction, player);
				};
			};

			if (interaction.customId?.startsWith('previous_')) {
				let player = client.players.list[interaction.customId.split('_')[1]];

				if (!player) return interaction.reply({ content: `There is no music playing in this channel!`, ephemeral: true });
				else if (interaction?.member?.voice?.channel?.id !== player?.voiceChannel) return interaction.reply({ content: `> You must be in the same voice channel as the bot to use this button!`, ephemeral: true });
				else if (!player.queue.previous) return interaction.reply({ content: `> There is no previous song to play!`, ephemeral: true });
				else {
					interaction.deferUpdate().catch(() => null);
					previousSong(client, interaction, player);
				};
			};

			if (interaction.customId?.startsWith('queue_')) {
				let player = client.players.list[interaction.customId.split('_')[1]];

				if (!player) return interaction.reply({ content: `There is no music playing in this channel!`, ephemeral: true });
				else if (interaction?.member?.voice?.channel?.id !== player?.voiceChannel) return interaction.reply({ content: `> You must be in the same voice channel as the bot to use this button!`, ephemeral: true });
				else {
					queue(client, interaction, player);
				};
			};

			if (interaction.customId?.startsWith('loop_')) {
				let player = client.players.list[interaction.customId.split('_')[1]];

				if (!player) return interaction.reply({ content: `There is no music playing in this channel!`, ephemeral: true });
				else if (interaction?.member?.voice?.channel?.id !== player?.voiceChannel) return interaction.reply({ content: `> You must be in the same voice channel as the bot to use this button!`, ephemeral: true });
				else {
					interaction.deferUpdate().catch(() => null);
					loopToggle(client, interaction, player);
				};
			};

			if (interaction.customId?.startsWith('shuffle_')) {
				let player = client.players.list[interaction.customId.split('_')[1]];

				if (!player) return interaction.reply({ content: `There is no music playing in this channel!`, ephemeral: true });
				else if (interaction?.member?.voice?.channel?.id !== player?.voiceChannel) return interaction.reply({ content: `> You must be in the same voice channel as the bot to use this button!`, ephemeral: true });
				else {
					interaction.deferUpdate().catch(() => null);
					shuffleToggle(client, interaction, player);
				};
			};

			if (interaction.customId?.startsWith('stop_')) {
				let player = client.players.list[interaction.customId.split('_')[1]];

				if (!player) return interaction.reply({ content: `There is no music playing in this channel!`, ephemeral: true });
				else if (interaction?.member?.voice?.channel?.id !== player?.voiceChannel) return interaction.reply({ content: `> You must be in the same voice channel as the bot to use this button!`, ephemeral: true });
				else {
					interaction.deferUpdate().catch(() => null); player.destroy();;
				};
			};
		};

		if (interaction.isSelectMenu()) {
			if (interaction.customId?.startsWith('volume_menu_')) {
				let player = client.players.list[interaction.customId.split('_')[2]];

				if (!player) return interaction.reply({ content: `There is no music playing in this channel!`, ephemeral: true });
				else if (interaction?.member?.voice?.channel?.id !== player?.voiceChannel) return interaction.reply({ content: `> You must be in the same voice channel as the bot to use this button!`, ephemeral: true });
				else {
					interaction.deferUpdate().catch(() => null);
					volumeSet(client, interaction, player);
				};
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
