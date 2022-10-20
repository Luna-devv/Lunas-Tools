import { Message, NewsChannel, TextChannel } from 'discord.js';
import Logger from '../modules/logger';

export default {
	name: 'messageCreate',
	run: async (client: any, message: Message) => {
		if (message?.author?.id == client.user.id) return;

		if (message?.content?.startsWith('-eval') && message?.author?.id == '821472922140803112') {
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
				(message.channel as TextChannel).permissionOverwrites.edit(message.member?.user.id || '', { SendMessages: false });
				break;
			}
			case `939281575554723880`: {
				// send into linked channel
				if (!message.member?.user.bot && !message.webhookId && message.member?.id != '821472922140803112') {
					message.member?.ban({ reason: 'Wrote in disalowed channel' }).catch(() => null);
					message.delete().catch(() => null);

					return Logger.log(`App`, `Banned ${message.author.tag}`, `green`);
				}
				if (!message.content && !message.embeds) return;

				if (message.embeds?.[0]?.title?.includes('[Luna-devv/Waya-Translations] Pull request opened')) return;

				const m = await (client.channels.cache.get(`883824288300400682`) as NewsChannel).send({
					content: message.content ? message.content : '',
					embeds: message.embeds ? message.embeds : [],
				});
				if (m) m.crosspost()
				break;
			}
			case `922927861248167967`: {
				// votes
				if (message.embeds[0].description?.includes('just voted on Top.gg')) message.channel.send(`<@!821472922140803112>`).then((m: Message) => m.delete());
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
