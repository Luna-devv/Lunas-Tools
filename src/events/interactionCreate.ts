import { CommandType } from '../json/typings';
import Logger from '../modules/logger';

export default {
	name: 'interactionCreate',
	run: async (client: any, interaction: any) => {
		if (interaction.isCommand()) {
			if (interaction.commandName == `music`) interaction.commandName = `Find Music Platforms`;
			const command: CommandType = client.interactions.get(interaction.commandName);

			if (!interaction.guild?.id)
				return interaction.reply({
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

			await command.run(interaction, client).catch((error: any) => Logger.log(`Interaction`, error, `red`));
		}
	},
};
