import { Message } from 'discord.js';
import Logger from '../modules/logger';

export default {
	name: 'messageCreate',
	run: async (client: any, message: any) => {
		if (message?.author?.id == client.user.id) return;

		if (message?.content?.startsWith('-eval') && message?.author?.id == '797012765352001557') {
			try {
				const code = message?.content?.split('-eval')[1]; let evaled = eval(code);
				if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);

				message.reply(`\`\`\`js\n${evaled}\n\`\`\``).catch(() => null);
			} catch (err) {
				message.reply(`\`\`\`js\n${err}\n\`\`\``).catch(() => null);
			};
		};

		switch (message.channel.id) {
			case `888790310732324984`: {
				// introduce your self
				message.channel.permissionOverwrites.edit(message.member.user.id, { SendMessages: false });
				break;
			}
			case `939281575554723880`: {
				// send into linked channel
				if (!message.member?.user.bot && !message.webhookId && message.member?.id != '821472922140803112') {
					message.member.ban({ reason: 'Wrote in disalowed channel' }).catch(() => null);
					message.delete().catch(() => null);

					return Logger.log(`App`, `Banned ${message.member.user.tag}`, `green`);
				}
				if (!message.content && !message.embeds) return;

				if (message.embeds?.[0]?.title.includes('[Luna-devv/Waya-Translations] Pull request opened')) return;

				client.channels.cache.get(`883824288300400682`).send({
					content: message.content ? message.content : null,
					embeds: message.embeds ? message.embeds : null,
				});
				break;
			}
			case `966063122584588378`: {
				// digital's github logs
				if (
					!message.member?.user.bot &&
					!message.webhookId &&
					message.member?.id != '797012765352001557' &&
					message.member?.id != '821472922140803112'
				) {
					message.member.ban({ reason: 'Wrote in disalowed channel' }).catch(() => null);
					message.delete().catch(() => null);

					return Logger.log(`App`, `Banned ${message.member.user.tag}`, `green`);
				}

				if (!message.content && !message.embeds) return;
				if (message.embeds[0]) {
					message.embeds[0].color = `#7289da`;
					message.embeds[0].author.name = 'The Digital';
					message.embeds[0].description = '> ' + message.embeds[0]?.description?.split('- Crni39\n').join('\n> ').slice(0, -9);
				}

				client.channels.cache
					.get(`956604381300654101`)
					.send({
						content: message.content ? message.content : null,
						embeds: message.embeds ? message.embeds : null,
					})
					.catch(() => null);
				break;
			}
			case `922927861248167967`: {
				// votes
				message.channel.send(`<@!821472922140803112>`).then((m: Message) => m.delete());
				break;
			}
			case '917050862742929480': {
				// no idea what this is
				setTimeout(() => message.delete(), 60 * 1000);
				break;
			}
		};
	},
};
