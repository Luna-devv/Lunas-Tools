import { Client, ContextMenuCommandInteraction } from 'discord.js';
import config from '../json/config';

export default {
	name: 'Check Spelling',
	run: async (interaction: ContextMenuCommandInteraction, client: Client) => {
		
		await interaction.deferReply({ ephemeral: true });

        //@ts-ignore
        let text = interaction.targetMessage.content;
		let data: any; await fetch(`https://serpapi.com/search.json?q=${text}&hl=en&gl=us&api_key=${config.spellKey}`, {
			method: `get`,
		}).then(async (res) => { data = await res.json(); }).catch(() => null);

		return interaction.editReply({
			content: data?.search_metadata?.status == `Success` ? (data?.search_information?.spelling_fix ? `**Suggestion**: \`${data?.search_information?.spelling_fix}\`` : `There are no spelling errors in this message.`) : `There was an error!`,
		});
	},
};
