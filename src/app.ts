/**
 *  Copyright (c) 2022 Luna Seemann
 *  https://github.com/Luna-devv/lunas-tools/blob/main/LICENSE
 *
 *  First fill out json/config.ts, then run the following commands:
 *
 *  npm install
 *  npm run ts
 *  npm run build
 *  npm run start
 *
 */

// ---------------------------------------------------- Imports

import Discord from 'discord.js';
import { Manager } from 'erela.js';
import config from './json/config';
import Logger from './modules/logger';
import Spotify from 'erela.js-spotify';

// ---------------------------------------------------- Discord

Logger.start(`App`, `Connecting to WebSocket..`, `blue`);

const client: any = new Discord.Client({
	allowedMentions: {
		parse: [`users`, `roles`],
	},
	presence: {
		status: `invisible`,
		activities: [
			{
				name: `at waya.one`,
				type: Discord.ActivityType.Watching,
			},
		],
	},
	intents: [
		Discord.GatewayIntentBits.Guilds,
		Discord.GatewayIntentBits.GuildMessages,
		Discord.GatewayIntentBits.MessageContent,
		Discord.GatewayIntentBits.GuildPresences,
		Discord.GatewayIntentBits.GuildMessageReactions,
		Discord.GatewayIntentBits.GuildVoiceStates,
	],
	partials: [Discord.Partials.Message, Discord.Partials.Reaction],
});

// ---------------------------------------------------- Erela.js

const erelaManager = new Manager({
	nodes: config.nodes,
	autoPlay: true,
	send: (id, payload) => {
		const guild = client.guilds.cache.get(id);
		if (guild) guild.shard.send(payload);
	},
	plugins: [
		new Spotify({
			clientID: config.spotify.clientId,
			clientSecret: config.spotify.clientSecret,
		})
	],
});

client.on(`raw`, (d: any) => erelaManager.updateVoiceState(d));

erelaManager.on(`nodeConnect`, (node) => {
	Logger.log(`Erela.js`, `Connected to node ${node.options.identifier}.`, `green`);
});

const errorSpamFilter: any = {};
erelaManager.on(`nodeError`, (node, error) => {
	if (!errorSpamFilter[(node as any).options.identifier]) Logger.log(`Erela.js`, `Error on node ${node.options.identifier}: ${error.message}`, `red`); 
	else errorSpamFilter[(node as any).options.identifier] = true;
});

// ---------------------------------------------------- Exports & modules

client.players = {
	list: {},
	temp: {},
	messages: {},
};
client.config = config;
client.logger = Logger;
client.manager = erelaManager;
client.interactions = new Discord.Collection();
client.wait = (time: number) => {
	return new Promise((smth) => setTimeout(smth, time));
};
client.formatTime = (ms: number, short: boolean) => {
	const sec: string = Math.floor((ms / 1000) % 60).toString();
	const min: string = Math.floor((ms / (1000 * 60)) % 60).toString();
	const hrs: string = Math.floor((ms / (1000 * 60 * 60)) % 60).toString();

	if (short) return `${hrs.padStart(2, "0") == "00" ? "" : hrs.padStart(2, "0") + ":"}${min.padStart(2, "0")}:${sec.padStart(2, "0")}`;
	else return `${hrs.padStart(2, "0") == "00" ? "" : hrs.padStart(2, "0") + " hours "}${min.padStart(2, "0")} minutes and ${sec.padStart(2, "0")} seconds`;
};
client.parseTime = (time: string, reversed?: boolean) => {
	if (!reversed) {
		const timeArray: string[] = time.split(" "); let ms: number = 0;

		timeArray.forEach((t: string) => {
			if (t.endsWith("s" || t.endsWith("c"))) ms += parseInt(t.slice(0, -1)) * 1000;
			else if (t.endsWith("m") || t.endsWith("n")) ms += parseInt(t.slice(0, -1)) * 60000;
			else if (t.endsWith("h") || t.endsWith("s")) ms += parseInt(t.slice(0, -1)) * 3600000;
			else if (t.includes(":")) {
				const timeArray2: string[] = t.split(":");
				if (timeArray2.length == 2) ms += parseInt(timeArray2[0]) * 60000 + parseInt(timeArray2[1]) * 1000;
				else if (timeArray2.length == 3) ms += parseInt(timeArray2[0]) * 3600000 + parseInt(timeArray2[1]) * 60000 + parseInt(timeArray2[2]) * 1000;
			};
		});
	return ms;
	} else {
		let ms: number = parseInt(time);
		let timeString: string = ``;
		if (ms >= 3600000) timeString += `${Math.floor(ms / 3600000)}h `;
		if (ms >= 60000) timeString += `${Math.floor((ms % 3600000) / 60000)}m `;
		if (ms >= 1000) timeString += `${Math.floor((ms % 60000) / 1000)}s `;
		return timeString;
	};
};

// ---------------------------------------------------- Handlers

require('./modules/web')?.default(client);
require('./modules/twitter')?.default(client);

const names: string[] = ['interactions', 'events'];
names.forEach((name: string) => {
	require(`./handlers/${name}`).default(client);
});

export default client;
client.login(client.config.token);

// ---------------------------------------------------- Processes

process.on('uncaughtException', async (error: any) => {
	console.error(1, typeof error, error); // debug
});

process.on('unhandledRejection', async (error: any) => {
	if (!error?.name?.toString()?.includes(`[10008]`)) console.error(2, typeof error, error); // hard debug
});

// ---------------------------------------------------- End of file