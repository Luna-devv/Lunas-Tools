/**
 *  Copyright (c) 2022 Luna Seemann
 *  https://github.com/Luna-devv/lunas-tools/blob/main/LICENSE
 * 
 *  First rename the config.example.js to config.js,
 *  then run the following commands:
 *
 *  npm i
 *  node .
 * 
 */

const {
    start,
    log,
    end
} = require(`./functions/logger`);
start(`App`, `Connecting to WebSocket..`, `blue`)

const {
    Client,
    Intents,
    Collection
} = require('discord.js');

const client = new Client({
    allowedMentions: {
        parse: [`users`, `roles`]
    },
    presence: {
        status: `dnd`,
        activities: [{
            name: `at waya.one`,
            type: `WATCHING`,
        }]
    },
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

const config = require(`./config.js`);
Object.keys(config).forEach(async (key) => {
    client[key] = config[key];
});

client.on(`ready`, () => {
    end(`App`, `Connected as ${client.user.tag}`, `blue`);
});

client.on(`messageCreate`, async (message) => {
    if (message.channel.id === `939281575554723880`) {
        if (!message.member?.user.bot && !message.webhookId && (message.member?.id != '821472922140803112')) {
            message.member.ban({ reason: 'Wrote in disalowed channel' }).catch(() => null);
            message.delete().catch(() => null);
            return log(`App`, `Banned ${message.member.user.tag}`, `green`);
        };
        if (!message.content && !message.embeds) return;
        if (message.embeds[0]?.color == `#7289da`) message.embeds[0].color = `#cd4065`;
        client.channels.cache.get(`883824288300400682`).send({
            content: message.content ? message.content : null,
            embeds: message.embeds ? message.embeds : null
        })
    };
});

client.login(client.token);