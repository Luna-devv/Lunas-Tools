module.exports = [
    {
        name: `graph`,
        description: `get a graph about a bot`,
        options: [
            {
                name: `id`,
                description: `From what bot do you want to see the graph?`,
                type: 3,
                required: true
            },
            {
                name: `data`,
                description: `What graph do you want to see?`,
                type: 3,
                required: true,
                choices: [
                    {
                        name: `guilds`,
                        value: `servers`
                    },
                    {
                        name: `votes`,
                        value: `monthlyVotes`
                    },
                    {
                        name: `total votes`,
                        value: `totalVotes`
                    },
                    {
                        name: `shards`,
                        value: `shardCount`
                    },
                    {
                        name: `rank`,
                        value: `rank`
                    }
                ]
            }
        ]
    }
];