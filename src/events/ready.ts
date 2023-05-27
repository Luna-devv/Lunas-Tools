import Logger from '../modules/logger';
import config from '../json/config';
import { Client } from 'discord.js';

export default {
	name: 'ready',
	once: true,

	run: async (client: Client) => {
		['828676951023550495', '810248284861366332'].forEach((guild) =>
			client.guilds.cache
				.get(guild)
				?.commands.set([])
				.catch(() => null)
		); // test guilds
		await client?.application?.commands?.set(require('../json/interactionsData').default); // all guilds

		// const banners = fs.readdirSync(path.join(__dirname, '../../banners'));
		// setInterval(() => {
		// 	const banner = banners[Math.floor(Math.random() * (banners.length - 1))];

		// 	const guild = client.guilds.cache.get('828676951023550495');
		// 	guild.setBanner(path.join(__dirname, `../../banners/${banner}`), 'banner swap');
		// }, 1000 * 60 * 13);

		// copy Luna's user status
		const user: any = client.guilds.cache.get('810248284861366332')?.presences?.cache?.get('821472922140803112');

		client?.user?.setPresence({ status: user?.status });
		(client as any).lastStatus = user?.status;

		Logger.end(`App`, `Connected as ${client?.user?.tag}.`, `blue`);

		// start music player
		(client as any).manager.init((client as any).user.id);

		// start twitter client
		(client as any)?.config?.twitter?.users?.forEach((user: { id: string; name: string }) => {
			(client as any).twitterClient.follow(user?.id);
			Logger.log(`Twitter`, `Started Following @${user.name}.`, `cyan`);
		});


		(await client.guilds.cache.get('828676951023550495')?.roles.fetch('1099067010031288382'))?.setName(`${new Intl.NumberFormat('en', { notation: 'standard' }).format(await getGuilds(['985213199248924722', '912003493777268767', '1097907896987160666', '857230367350063104']))} guilds`);
		setTimeout(async () => {
			(await client.guilds.cache.get('828676951023550495')?.roles.fetch('1099067010031288382'))?.setName(`${new Intl.NumberFormat('en', { notation: 'standard' }).format(await getGuilds(['985213199248924722', '912003493777268767', '1097907896987160666', '857230367350063104']))} guilds`);
		}, 10_000);

	},
};

async function getGuilds(bots: string[]) {
	const guilds: number[] = [];

	for await (const bot of bots) {
		const response = await fetch(`https://dblstatistics.com/api/bots/${bot}`, {
			headers: {
				Authorization: config.TOPGG_TOKEN,
				'Content-Type': 'application/json',
			}
		}).then(r => r.json()) as TopggBot;
		guilds.push(response.server_count);
	}

	return guilds.reduce((prev, curr) => prev + curr);
}

interface TopggBot {
	certified: boolean;
	owners: string[];
	deleted: boolean;
	id: string;
	name: string;
	def_avatar: string;
	avatar: string | null;
	short_desc: string;
	lib: string | null;
	prefix: string;
	website: string | null;
	approved_at: Date | null;
	monthly_votes: number;
	server_count: number;
	total_votes: number;
	shard_count: number;
	monthly_votes_rank: number;
	server_count_rank: number;
	total_votes_rank: number;
	shard_count_rank: number;
	timestamp: Date;
	unix_timestamp: number;
}