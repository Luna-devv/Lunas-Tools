import { Activity, GuildMember, User } from 'discord.js';
import { CustomActivityType } from 'src/json/typings';
import { Request, Response } from 'express';
import client from '../app';

export default [
	{
		path: '/losti',
		method: 'get',
		run: async (req: Request, res: Response) => {
			const forceLosti: User = await client.users.fetch(`421991668556759042`, { force: true });
			const losti: GuildMember = await (await client.guilds.cache.get(`828676951023550495`))?.members.fetch(`421991668556759042`);

			if (!losti?.user?.id || !forceLosti?.id)
				return res.status(500).json({
					status: 500,
					message: `Cannot fetch Losti.`,
				});

			let color: string = `#999999`;
			switch (losti.presence?.status) {
				case `online`: {
					color = `#7bcba7`;
					break;
				}
				case `dnd`: {
					color = `#f17f7e`;
					break;
				}
				case `idle`: {
					color = `#fcc061`;
					break;
				}
			}

			let emote: string | undefined, text: string | undefined;
			if (losti.presence?.activities.find((activitie) => activitie.type == 4)) {
				const status: Activity | undefined = losti.presence?.activities.find((activitie) => activitie.type == 4);
				if (status?.emoji?.id) emote = `https://cdn.discordapp.com/emojis/${status.emoji.id}.${status.emoji.animated ? `gif` : `png`}?size=2048`;
				if (status?.state) text = status.state;
			}
			let status: {
				state: {
					text: string | undefined;
					color: string | undefined;
				};
				emote: string | undefined;
				text: string | undefined;
			} = { state: { text: losti.presence?.status, color: color }, emote: emote, text: text };

			let activities: CustomActivityType[] = [];
			losti.presence?.activities?.forEach((activitie: Activity) => {
				if (activitie.name == `Spotify`) {
					activities.push({
						applicationId: activitie.applicationId,
						name: activitie.name,
						url: activitie.url,
						details: activitie.details,
						state: activitie.state,
						createdTimestamp: activitie.createdTimestamp,
						timestamps: {
							start: activitie.timestamps?.start ? new Date(activitie.timestamps?.start).getTime() : null,
							end: activitie.timestamps?.end ? new Date(activitie.timestamps?.end).getTime() : null,
						},
						assets: {
							large: {
								text: activitie.assets?.largeText,
								image: activitie.assets?.largeImage
									? activitie.assets.largeImage.startsWith(`spotify:`)
										? `https://i.scdn.co/image/${activitie.assets.largeImage.replace(/spotify:/, ``)}`
										: `https://i.scdn.co/image/${activitie.assets.largeImage}.png`
									: null,
							},
							small: {
								text: activitie.assets?.smallText,
								image: activitie.assets?.smallImage
									? `https://cdn.discordapp.com/app-assets/${activitie.applicationId}/${activitie.assets.smallImage}.png`
									: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/1200px-Spotify_logo_without_text.svg.png',
							},
						},
					});
				} else if (activitie.name != `Custom Status`) {
					activities.push({
						applicationId: activitie.applicationId,
						name: activitie.name,
						url: activitie.url,
						details: activitie.details,
						state: activitie.state,
						createdTimestamp: activitie.createdTimestamp,
						timestamps: {
							start: activitie.timestamps?.start ? new Date(activitie.timestamps?.start).getTime() : null,
							end: activitie.timestamps?.end ? new Date(activitie.timestamps?.end).getTime() : null,
						},
						assets: {
							large: {
								text: activitie.assets?.largeText,
								image: activitie.assets?.largeImage
									? activitie.assets.largeImage.startsWith(`mp:external`)
										? `https://media.discordapp.net/${activitie.assets.largeImage.replace(/mp:/, ``)}`
										: `https://cdn.discordapp.com/app-assets/${activitie.applicationId}/${activitie.assets.largeImage}.png`
									: null,
							},
							small: {
								text: activitie.assets?.smallText,
								image: activitie.assets?.smallImage
									? activitie.assets.smallImage.startsWith(`mp:external`)
										? `https://media.discordapp.net/${activitie.assets.smallImage.replace(/mp:/, ``)}`
										: `https://cdn.discordapp.com/app-assets/${activitie.applicationId}/${activitie.assets.smallImage}.png`
									: null,
							},
						},
					});
				}
			});

			return res.status(200).json({
				status: 200,
				message: `OK`,
				content: {
					id: losti.user.id,
					username: losti.user.username,
					discriminator: losti.user.discriminator,
					nickname: losti.nickname || losti.user.username,
					nickavatar: losti.avatar
						? `https://cdn.discordapp.com/guilds/${losti.guild.id}/users/${losti.id}/avatars/${losti.avatar}.${losti.avatar?.startsWith(`a_`) ? `gif` : `png`
						}?size=2048`
						: null,
					status: status,
					activities: activities,
					createdTimestamp: losti.user.createdTimestamp,
					avatar: losti.user.avatar
						? `https://cdn.discordapp.com/avatars/${losti.user.id}/${losti.user.avatar}.${losti.user.avatar?.startsWith('a_') ? 'gif' : 'png'
						}?size=2048`
						: null,
					banner: forceLosti.banner
						? `https://cdn.discordapp.com/banners/${losti.user.id}/${forceLosti.banner}.${forceLosti.banner?.startsWith('a_') ? 'gif' : 'png'
						}?size=600`
						: null,
					accentColor: `#${parseInt(forceLosti?.accentColor?.toString() || `6057195`, 10).toString(16)}`,
				},
			});
		},
	},
];
