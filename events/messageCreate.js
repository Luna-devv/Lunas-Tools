const { log } = require(`../functions/logger`);

module.exports = {
    name: 'messageCreate',
    run: async (message) => {
        if (message.author.id == '917377569857351722') return;
        const client = message.client;

        switch (message.channel.id) {
            case `888790310732324984`: {    // introduce your self
                if (message.guild.id !== client.server_id) return;
                if (!message.guild.me.permissions.has(`MANAGE_CHANNELS`)) return;
                message.channel.permissionOverwrites.edit(message.member.user.id, { SEND_MESSAGES: false });
                break;
            };
            case `939281575554723880`: {    // send into linked channel
                if (!message.member?.user.bot && !message.webhookId && (message.member?.id != '821472922140803112')) {
                    message.member.ban({ reason: 'Wrote in disalowed channel' }).catch(() => null);
                    message.delete().catch(() => null);
                    return log(`App`, `Banned ${message.member.user.tag}`, `green`);
                };
                if (!message.content && !message.embeds) return;

                if (((message.embeds[0]?.color == `#7289da`) || !message.embeds[0]?.color) && message.embeds[0]) message.embeds[0].color = `#cd4065`;

                client.channels.cache.get(`883824288300400682`).send({
                    content: message.content ? message.content : null,
                    embeds: message.embeds ? message.embeds : null
                });
                break;
            };
            case `966063122584588378`: {    // digital's shit, k thx
                if (!message.member?.user.bot && !message.webhookId && (message.member?.id != '797012765352001557' && message.member?.id != '821472922140803112')) {
                    message.member.ban({ reason: 'Wrote in disalowed channel' }).catch(() => null);
                    message.delete().catch(() => null);
                    return log(`App`, `Banned ${message.member.user.tag}`, `green`);
                };
                if (!message.content && !message.embeds) return;

                if (message.embeds[0]) {
                    message.embeds[0].color = `#7289da`;
                    message.embeds[0].author.name = 'The Digital';
                    message.embeds[0].description = '> ' + message.embeds[0]?.description?.split('- Crni39\n').join('\n> ').slice(0, -9);
                };

                client.channels.cache.get(`956604381300654101`).send({
                    content: message.content ? message.content : null,
                    embeds: message.embeds ? message.embeds : null
                }).catch(() => null);
                break;
            };
            case `922927861248167967`: {
                message.channel.send(`<@!821472922140803112>`).then(m => m.delete());
		break;
 	    };
	   case '917050862742929480': {
                setTimeout(() => message.delete(), 60 * 1000);
                break;
            };

        };

    }
};
