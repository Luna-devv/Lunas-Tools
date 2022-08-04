import { CommandType } from '../json/typings';
import Logger from '../functions/logger';
import Discord from 'discord.js';

export default {
    name: 'interactionCreate',
    run: async (interaction: any, client: any) => {

        if (interaction.type == Discord.InteractionType.ApplicationCommand) {
            const command: CommandType = client.interactions.get(interaction.commandName);

            if (!interaction.guild?.id) return interaction.reply({
                content: `This command can't be used inside Private Messages.`,
                ephemeral: true,
                components: [{
                    type: 1,
                    components: [{
                        type: 2,
                        label: `Invite Waya`,
                        style: 5,
                        url: `https://waya.one/add`
                    }]
                }]
            });

            await command.run(interaction, client).catch((error: any) => Logger.log(`Interaction`, error, `red`));
        };
    }
};