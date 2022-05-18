const axios = require(`axios`);

module.exports = {
    name: 'graph',
    run: async (
        interaction, client
    ) => {
        let user = await client.users.fetch(interaction.options.getString('id'), { force: true }).catch(() => null);

        if (!interaction.options.getString('id') || !user?.bot) return interaction.reply({
            content: `Provided bot ID is not valid!`,
            ephemeral: true
        });

        let data = await axios({ method: `get`, url: `https://dblstatistics.com/api/bots/${user?.id}`, headers: { 'Authorization': client.authToken } }).catch(() => null)

        if (!data?.data?.id) return interaction.reply({
            content: `That bot is not in Top.gg database!`,
            ephemeral: true
        });

        interaction.reply({
            content: `https://dblstatistics.com/bot/${data.data.id}/widget/${interaction.options.getString('data')}?width=3000&height=1000&backgroundColor=26252e&titleFontSize=30&labelFontSize=28&cache=${new Date(Date.now()).getTime()}`
        });
    }
};