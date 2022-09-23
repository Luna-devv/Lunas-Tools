export default [
	{
		name: 'Check Spelling',
		type: 3
	},
	{
		name: 'Find Music Platforms',
		type: 3
	},
	{
		name: 'music',
		type: 1,
		description: 'Find music platforms',
		options: [
			{
				name: 'search',
				description: 'Search for a song on all platforms with it\'s link',
				type: 3,
				required: true
			},
			{
				name: 'visibility',
				description: 'Visibility of the message',
				type: 3,
				required: false,
				choices: [
					{
						name: 'Everyone',
						value: 'everyone'
					},
					{
						name: 'Only Me',
						value: 'onlyme'
					}
				],
			}
		]
	},
	{
		name: 'graph',
		type: 1,
		description: 'Get a graph about a bot',
		options: [
			{
				name: 'id',
				description: 'From what bot do you want to see the graph?',
				required: true,
				type: 3,
			},
			{
				name: 'data',
				description: 'What graph do you want to see?',
				required: true,
				type: 3,
				choices: [
					{
						name: 'Rank',
						value: 'rank',
					},
					{
						name: 'Votes',
						value: 'monthlyVotes',
					},
					{
						name: 'Shards',
						value: 'shardCount',
					},
					{
						name: 'Guilds',
						value: 'servers',
					},
					{
						name: 'Total Votes',
						value: 'totalVotes',
					},
				],
			},
		],
	},
	{
		name: 'suggest',
		type: 1,
		description: 'Do suggestions in this server.',
		options: [
			{
				name: 'create',
				description: 'Wanna suggest some things for Waya?',
				type: 1,
				options: [
					{
						name: 'suggestion',
						description: 'What do you want to suggest?',
						type: 3,
						required: true,
						max_length: 500,
					},
				],
			},
			{
				name: 'manage',
				description: 'Manage suggestions or delete them.',
				type: 1,
				options: [
					{
						name: 'option',
						description: 'What action do you want to perform?',
						type: 3,
						required: true,
						choices: [
							{
								name: 'Consider',
								value: 'consider',
							},
							{
								name: 'Accept',
								value: 'accept',
							},
							{
								name: 'Implemented',
								value: 'done',
							},
							{
								name: 'Alread Implemented',
								value: 'already',
							},
							{
								name: 'Deny',
								value: 'deny',
							},
							{
								name: 'Delete',
								value: 'delete',
							},
						],
					},
					{
						name: 'id',
						description: 'Whats the message Id of the suggestion?',
						type: 3,
						required: true,
					},
					{
						name: 'reason',
						description: 'Why did you choose to perform this action?',
						type: 3,
						required: true,
						max_length: 500,
					},
				],
			},
		],
	},
];
