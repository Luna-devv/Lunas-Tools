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
		description: 'Play music in your voice channel',
		options: [
			{
				name: 'platforms',
				type: 1,
				description: 'Find music platforms',
				options: [
					{
						name: 'search',
						type: 3,
						description: 'Search for a song on all platforms with it\'s link',
						required: true
					},
					{
						name: 'visibility',
						type: 3,
						description: 'Visibility of the message',
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
				name: 'play',
				type: 1,
				description: 'Play a song',
				options: [
					{
						name: 'search',
						type: 3,
						description: 'Search for a song',
						required: true
					}
				]
			},
			{
				name: 'volume',
				type: 1,
				description: 'Change the volume',
				options: [
					{
						name: 'percentage',
						type: 10,
						description: 'The volume percentage',
						required: true,
						min_value: 0,
						max_value: 100
					}
				]
			},
			{
				name: 'skip',
				type: 1,
				description: 'Skip the current song',
			},
			{
				name: 'previous',
				type: 1,
				description: 'Play the previous song',
			},
			{
				name: 'stop',
				type: 1,
				description: 'Stop the music',
			},
			{
				name: 'pause',
				type: 1,
				description: 'Pause the music',
			},
			{
				name: 'resume',
				type: 1,
				description: 'Resume the music',
			},
			{
				name: 'queue',
				type: 1,
				description: 'Show the queue',
			},
			{
				name: 'shuffle',
				type: 1,
				description: 'Shuffle the queue',
			},
			{
				name: 'loop',
				type: 1,
				description: 'Loop the queue',
			},
		]
	},
	{
		name: 'graph',
		type: 1,
		description: 'Get a graph about a bot',
		options: [
			{
				name: 'id',
				type: 3,
				description: 'From what bot do you want to see the graph?',
				required: true,
			},
			{
				name: 'data',
				type: 3,
				description: 'What graph do you want to see?',
				required: true,
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
				type: 1,
				description: 'Wanna suggest some things for Waya?',
				options: [
					{
						name: 'suggestion',
						type: 3,
						description: 'What do you want to suggest?',
						required: true,
						max_length: 500,
					},
				],
			},
			{
				name: 'manage',
				type: 1,
				description: 'Manage suggestions or delete them.',
				options: [
					{
						name: 'option',
						type: 3,
						description: 'What action do you want to perform?',
						required: true,
						choices: [
							{
								name: 'Comment',
								value: 'comment',
							},
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
						type: 3,
						description: 'Whats the message Id of the suggestion?',
						required: true,
					},
					{
						name: 'reason',
						type: 3,
						description: 'Why did you choose to perform this action?',
						required: true,
						max_length: 500,
					},
				],
			},
		],
	},
];
