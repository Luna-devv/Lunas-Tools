module.exports = {
    name: 'graph',
    run: async (
        interaction, client
    ) => {
        interaction.reply({
            content: `https://dblstatistics.com/bot/${interaction.options.getString('id')}/widget/${interaction.options.getString('data')}?width=3000&height=1000&backgroundColor=26252e&titleFontSize=30&labelFontSize=28&cache=${new Date(Date.now()).getTime()}`
        });
    }
};