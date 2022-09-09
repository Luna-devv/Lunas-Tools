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
import config from './json/config';
import Logger from './modules/logger';

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
	],
	partials: [Discord.Partials.Message, Discord.Partials.Reaction],
});

// ---------------------------------------------------- Exports & modules

client.config = config;
client.logger = Logger;
client.interactions = new Discord.Collection();
client.wait = (time: number) => {
	return new Promise((smth) => setTimeout(smth, time));
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

process.on('unhandledRejection', async (error: any) => {
	console.error(error);
});

process.on('uncaughtException', async (error: any) => {
	console.error(error);
});

// ---------------------------------------------------- End of file
