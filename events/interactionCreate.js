module.exports = {
    name: 'interactionCreate',
    run: async (interaction) => {

        interaction.reply({
            epemeral: true,
            content: `Lol? YOu think this really works xd`,
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: `Waya Bot`,
                            style: 5,
                            url: `https://waya.one`
                        }
                    ]
                }
            ]
        });

    }
};