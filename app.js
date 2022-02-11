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
const { writeFileSync, unlink } = require(`fs`);

const client = new Client({
    allowedMentions: {
        parse: [`users`, `roles`]
    },
    presence: {
        status: `invisible`,
        activities: [{
            name: `at waya.one`,
            type: `WATCHING`
        }]
    },
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_PRESENCES
    ]
});

const config = require(`./config.js`);
Object.keys(config).forEach(async (key) => {
    client[key] = config[key];
});

let lastStatus;
client.on(`ready`, async () => {
    const user = await client.users.fetch(`821472922140803112`);
    client.user.setPresence({ status: user?.status });
    lastStatus = user?.status;

    end(`App`, `Connected as ${client.user.tag}`, `blue`);
});

client.on(`presenceUpdate`, async (oldRpc, newRpc) => {     // copy my status
    if (newRpc?.userId != `821472922140803112`) return;
    if (newRpc?.status != lastStatus) client.user.setPresence({ status: newRpc?.status, activities: [{ name: `at waya.one`, type: `WATCHING`, }] });
});

client.on(`messageCreate`, async (message) => {     // message event

    if (message.content.startsWith(`<@!${client.user.id}>`) && message.member.id == `821472922140803112`) {     // eval
        try {
            const args = message.content.split(` `);
            args.shift();
            args.shift();

            let evaluate;
            if (args[0]?.includes(`-c`)) {
                args.shift();
                evaluate = args.join(` `)?.slice(3, -3);
            } else evaluate = args.join(` `);

            if (evaluate.length === 0) return;
            let result = eval(evaluate);

            if (result == `Promise { <pending> }` || result == `[object Promise]`) return;
            if (typeof result === `string`) {
                if (result?.toLocaleString().length > 1950) {
                    const FileName = `eval_${Date.now()}.js`;
                    const FileMsg = `/*\nUser: ${message.member.user.username}#${message.member.user.discriminator} (${message.member.id})\nServer: ${message.guild.name} (${message.guild.id})\nChannel: #${message.channel.name} (${message.channel.id})\n*/\n\n//Evaluated:\n${evaluate}\n\n//Result:\n${result}`;
                    writeFileSync(FileName, FileMsg);

                    await message.channel.send({
                        content: `The result is too long.. The result can be seen in the attached file.`,
                        files: [{
                            attachment: `./${FileName}`,
                            name: `${FileName}`
                        }]
                    });

                    unlink(`${FileName}`, error => {
                        if (error) log(`Eval`, error, `yellow`);
                    });
                } else message.channel.send({ content: `\`\`\`js\n${result}\`\`\`` });
            } else return message.channel.send({ content: `\`\`\`js\n${result}\`\`\`` });

        } catch (error) {
            log(`Eval`, error, `yellow`);
            message.channel.send({ content: `\`\`\`js\n${error}\`\`\`` });
        };
    }

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

});

client.login(client.token);