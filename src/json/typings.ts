export type Config = {
	server_id: string;
	authToken: string;
	token: string;
	server: {
		port: number;
	};
	twitter: {
		users: {
			id: string;
			name: string;
		}[];
		channels: string[];
		twitterApiKey: string;
		twitterApiSecret: string;
		twitterAccessTokenKey: string;
		twitterAccessTokenSecret: string;
	};
};

export type CustomActivityType = {
	applicationId: string | null;
	name: string | null;
	url: string | null;
	details: string | null;
	state: string | null;
	createdTimestamp: number | null;
	timestamps: {
		start: number | null;
		end: number | null;
	};
	assets: {
		large: {
			text: string | null | undefined;
			image: string | null;
		};
		small: {
			text: string | null | undefined;
			image: string | null;
		};
	};
};

export type ButtonObject = {
	type: 2;
	style: 1 | 2 | 3 | 4 | 5;
	label: string;
	emoji: string;
	url?: string;
	custom_id?: string;
};

export type CommandType = {
	name: string;
	run: (interaction: any, client: any) => Promise<void>;
};

export type EventType = {
	name: string;
	once?: boolean;
	run: (...args: any[]) => Promise<void>;
};
