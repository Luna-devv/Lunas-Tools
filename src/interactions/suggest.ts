import { Client, CommandInteraction, TextChannel } from 'discord.js';

export default {
    name: 'suggest',
    run: async (interaction: CommandInteraction, client: Client) => {
        //@ts-ignore
        const command = interaction.options.getSubcommand(true);
        await interaction.deferReply({ ephemeral: true });

        switch (command) {
            case 'create': {
                //@ts-ignore
                const suggestion = interaction.options.getString('suggestion');
                await (client.channels.cache.get((client as any).config.suggestions) as TextChannel)?.send({
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

                interaction.editReply({
                    content: 'Your Suggestion has been successfully submited',
                });

                break; //end 'write'
            }
            case 'manage': {
                if (!interaction.memberPermissions?.has('Administrator'))
                    return interaction.editReply({
                        content: 'lol no perms',
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
                        content: 'no message lol',
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
                            color: getColorStuff(option),
                        },
                    ],
                });

                interaction.editReply({
                    content: 'done',
                });

                break; //end 'write'
            }
        }
    },
};

function getColorStuff(thing: 'consider' | 'accept' | 'already' | 'deny'): number {
    switch (thing) {
        case 'consider':
            return 0xbdb58a;
        case 'accept':
            return 0x8da895;
        case 'already':
            return 0x8abdba;
        case 'deny':
            return 0xbd8a8d;
    }
}

function getSuckName(thing: 'consider' | 'accept' | 'already' | 'deny'): string {
    switch (thing) {
        case 'consider':
            return 'Considered';
        case 'accept':
            return 'Accepted';
        case 'already':
            return 'Already Implemented';
        case 'deny':
            return 'Denied';
    }
}
