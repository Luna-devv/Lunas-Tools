module.exports = {
    name: 'interactionCreate',
    run: async (interaction) => {

        interaction.reply({
            epemeral: true,
            content: `Lol? You think this really works xD`,
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: `Waya Bot`,
                            style: 5,
                            url: `https://waya.one/`
                        }
                    ]
                }
            ]
        });

    }
};