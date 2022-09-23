import { Client, CommandInteraction, ContextMenuCommandInteraction } from 'discord.js';
import findMusic from '../modules/music';

export default {
	name: 'Find Music Platforms',
	run: async (interaction: ContextMenuCommandInteraction | CommandInteraction, client: Client) => {
        
        //@ts-ignore
		await interaction.deferReply({ ephemeral: interaction?.options?.getString('visibility') || true });

        //@ts-ignore
        let text = interaction?.targetMessage?.content || interaction?.options?.getString('search');
		let data = await findMusic(text);

		return interaction.editReply({
            content: data?.success ? null : `No music platforms found!`,
            components: data?.success ? [{ type: 1, components: data.buttons }] : []
		});
	},
};
