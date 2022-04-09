module.exports = [
    {
        name: `spawn`,
        type: `SUB_COMMAND_GROUP`,
        description: `Spawn a menu lol`,
        options: [
            {
                name: `query`,
                description: `What menu you want to spawn.`,
                type: 3,
                required: true,
                choices: [
                    {
                        name: `pings`,
                        value: `pings`
                    }
                ]
            }
        ]
    }
];