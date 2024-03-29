import { Client, CommandInteraction, TextChannel } from 'discord.js';

export default {
    name: 'suggest',
    run: async (interaction: CommandInteraction, client: Client) => {
        //@ts-ignore
        const command = interaction.options.getSubcommand(true);
        await interaction.deferReply({ ephemeral: true });

        if (["962721082769547294"].includes(interaction.user.id))
            return interaction.editReply({
                content: 'You\'ve been banned from the suggestion system for abusing it.',
            });

        switch (command) {
            case 'create': {
                //@ts-ignore
                const suggestion = interaction.options.getString('suggestion');

                await (client.channels.cache.get((client as any).config.suggestions) as TextChannel)?.send('<@&1028637637185114173>');
                const message = await (client.channels.cache.get((client as any).config.suggestions) as TextChannel)?.send({
                    embeds: [
                        {
                            author: {
                                name: interaction.user.tag,
                                icon_url: interaction.user.displayAvatarURL(),
                            },
                            fields: [
                                {
                                    name: `<t:${Math.floor(new Date().getTime() / 1000)}:t> <t:${Math.floor(new Date().getTime() / 1000)}:d> • Suggestion`,
                                    value: suggestion,
                                },
                            ],
                            color: 0xbda9a8,
                        },
                    ],
                });

                message.react('<:tick:1017781086102761543>');
                message.react('<:cross:1017781065340964934>');

                interaction.editReply({
                    content: 'Your Suggestion has been successfully submited.',
                });

                break; //end 'write'
            }
            case 'manage': {
                if (!interaction.memberPermissions?.has('Administrator'))
                    return interaction.editReply({
                        content: 'You do not have the required permissions to use this command.',
                    });

                const channel = client.channels.cache.get((client as any).config.suggestions);
                //@ts-ignore
                const message = (channel as TextChannel).messages.cache.get(interaction.options.getString('id')) || (await (channel as TextChannel).messages.fetch(interaction.options.getString('id')));
                //@ts-ignore
                const option = interaction.options.getString('option');
                //@ts-ignore
                const reason = interaction.options.getString('reason');

                if (!message)
                    return interaction.editReply({
                        content: 'There is no message with that ID.',
                    });

                if (option === 'delete') return message.delete();

                const fields = message.embeds[0].fields;
                fields.push({
                    name: `<t:${Math.floor(new Date().getTime() / 1000)}:t> <t:${Math.floor(new Date().getTime() / 1000)}:d> • ${getSuckName(option)}`,
                    value: reason,
                });

                await message.edit({
                    embeds: [
                        {
                            author: message.embeds[0].author || undefined,
                            fields: fields,
                            color: option == 'comment' ? (message.embeds[0].color ?? 0x2f3136) : getColorStuff(option),
                        },
                    ],
                });

                interaction.editReply({
                    content: 'Your Suggestion has been successfully managed.',
                });

                break; //end 'write'
            }
        }
    },
};

function getColorStuff(thing: 'consider' | 'accept' | 'done' | 'already' | 'deny'): number {
    switch (thing) {
        case 'consider':
            return 0xbdb58a;
        case 'accept':
            return 0x8da895;
        case 'done':
            return 0x94c293;
        case 'already':
            return 0x8abdba;
        case 'deny':
            return 0xbd8a8d;
    }
}

function getSuckName(thing: 'comment' | 'consider' | 'accept' | 'done' | 'already' | 'deny'): string {
    switch (thing) {
        case 'comment':
            return 'Comment';
        case 'consider':
            return 'Considered';
        case 'accept':
            return 'Accepted';
        case 'done':
            return 'Implemented';
        case 'already':
            return 'Already Implemented';
        case 'deny':
            return 'Denied';
    }
}
