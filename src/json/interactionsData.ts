export default [
    {
        name: `graph`,
        description: `get a graph about a bot`,
        options: [{
            name: `id`,
            description: `From what bot do you want to see the graph?`,
            required: true,
            type: 3,
        }, {
            name: `data`,
            description: `What graph do you want to see?`,
            required: true,
            type: 3,
            choices: [{
                name: `Rank`,
                value: `rank`
            }, {
                name: `Votes`,
                value: `monthlyVotes`
            }, {
                name: `Shards`,
                value: `shardCount`
            }, {
                name: `Guilds`,
                value: `servers`
            }, {
                name: `Total Votes`,
                value: `totalVotes`
            }]
        }]
    }
];