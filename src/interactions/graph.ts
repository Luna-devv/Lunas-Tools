import { Client, CommandInteraction } from "discord.js";

export default {
	name: 'graph',
	run: async (interaction: CommandInteraction, client: Client) => {
		//@ts-ignore
		let user = await client.users.fetch(interaction.options.getString('id'), { force: true }).catch(() => null);


		if (!user?.bot)
			return interaction.reply({
				content: `Provided bot ID is not valid!`,
				ephemeral: true,
			});

		let data: any = await fetch(`https://dblstatistics.com/api/bots/${user?.id}`, {
			method: `get`,
			headers: {
				Authorization: (client as any)?.config?.authToken,
			} as {
				[x: string]: string;
			},
		}).catch(() => null);

		if (!data?.data?.id)
			return interaction.reply({
				content: `That bot is not in Top.gg database!`,
				ephemeral: true,
			});

		return interaction.reply({
			//@ts-ignore
			content: `https://dblstatistics.com/bot/${data.data.id}/widget/${interaction.options.getString(
				'data'
			)}?width=3000&height=1000&backgroundColor=26252e&titleFontSize=30&labelFontSize=28&cache=${new Date(Date.now()).getTime()}`,
		});
	},
};
