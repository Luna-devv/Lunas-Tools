module.exports = {
    name: 'messageCreate',
    run: async (message) => {
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
        };

    }
};