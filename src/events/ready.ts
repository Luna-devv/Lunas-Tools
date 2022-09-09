import Logger from '../modules/logger';
import path from 'path';
import fs from 'fs';

export default {
	name: 'ready',
	once: true,

	run: async (client: any) => {
		['828676951023550495', '810248284861366332'].forEach((guild) =>
			client.guilds.cache
				.get(guild)
				?.commands.set([])
				.catch(() => null)
		); // test guilds
		await client?.application?.commands?.set(require('../json/interactionsData').default); // all guilds

		const banners = fs.readdirSync(path.join(__dirname, '../../banners'));
		setInterval(() => {
			const banner = banners[Math.floor(Math.random() * (banners.length - 1))];

			const guild = client.guilds.cache.get('828676951023550495');
			guild.setBanner(path.join(__dirname, `../../banners/${banner}`), 'banner swap');
		}, 1000 * 60 * 16);

		// copy Luna's user status
		const user: any = client.guilds.cache.get('810248284861366332')?.presences?.cache?.get('821472922140803112');

		client?.user?.setPresence({ status: user?.status });
		client.lastStatus = user?.status;

		Logger.end(`App`, `Connected as ${client?.user?.tag}.`, `blue`);

		// start twitter client
		client?.config?.twitter?.users?.forEach((user: { id: string; name: string }) => {
			client.twitterClient.follow(user?.id);
			Logger.log(`Twitter`, `Started Following @${user.name}.`, `cyan`);
		});
	},
};
