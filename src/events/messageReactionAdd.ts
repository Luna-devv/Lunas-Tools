import { GuildMember } from 'discord.js';

export default {
	name: `messageReactionAdd`,
	run: async (client: any, reaction: any, user: GuildMember) => {
		if (reaction.partial) await reaction.fetch().catch(() => null);
		if (reaction.message?.partial) await reaction.message?.fetch().catch(() => null);

		if (reaction.message.channel.id != '853641015755931669') return; // starboard channel
		if (reaction._emoji.id == '858087981167542322') return reaction.users.remove(user.id); // star emoji remove
	},
};
