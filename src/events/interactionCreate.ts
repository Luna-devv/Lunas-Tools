const { log } = require(`../functions/logger`);

module.exports = {
    name: 'interactionCreate',
    run: async (interaction) => {

        if (interaction.isCommand()) { //////////// star 'command'
            const command = interaction.client.interactions.get(interaction.commandName);

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
            command.run(interaction, interaction.client).catch(error => log(`Interaction`, error, `red`));
            //////////// end 'command'
        };

    }
};