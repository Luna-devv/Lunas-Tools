import { ButtonObject } from '../json/typings';
import Logger from './logger';
import Twit from 'node-tweet-stream';

export default async (client: any) => {
	const twitterClient: typeof Twit = new Twit({
		consumer_key: client?.config?.twitter?.twitterApiKey,
		consumer_secret: client?.config?.twitter?.twitterApiSecret,
		token: client?.config?.twitter?.twitterAccessTokenKey,
		token_secret: client?.config?.twitter?.twitterAccessTokenSecret,
	});

	client.twitterClient = twitterClient;

	twitterClient.on('tweet', async (tweet: any) => {
		if (tweet?.in_reply_to_screen_name) return;

		client?.config?.twitter?.users?.forEach(async (user: { id: string; name: string }) => {
			if (tweet.user.id == user.id && tweet.user.screen_name == user.name) {
				let buttons: ButtonObject[] = [
					{
						type: 2,
						style: 5,
						label: `Tweet`,
						emoji: `<:peepoLove:924058182626721802>`,
						url: `https://twitter.com/${tweet?.user?.screen_name}/status/${tweet?.id_str}`,
					},
				];

				if (tweet?.is_quote_status) {
					buttons.push({
						type: 2,
						style: 5,
						label: `Original Post`,
						emoji: `<a:c_prideflag:932368173494304849>`,
						url: tweet?.quoted_status_permalink?.expanded,
					});

					tweet.entities.media = tweet?.quoted_status?.entities?.media;
				}

				if (tweet?.text?.startsWith(`RT`))
					tweet.text = tweet.text?.replace(
						`RT @${tweet?.retweeted_status?.user?.screen_name}:`,
						`Retweet from [@${tweet?.retweeted_status?.user?.screen_name}](https://twitter.com/${tweet.retweeted_status?.user?.screen_name}):`
					);

				let desc: string | null = await formatDesc(client, tweet?.text); // don't blame me lmao

				client?.config?.twitter?.channels?.forEach((id: any) => {
					try {
						let channel = client?.channels?.cache?.get(id); // just no, ffs

						// channel?.send({
						// 	content: `${tweet?.['i' + 's' + '_' + 'q' + 'u' + 'o' + 't' + 'e' + '_' + 's' + 't' + 'a' + 't' + 'u' + 's'] ? '' : '<' + '@' + '&' + '9' + '5' + '3' + '9' + '9' + '2' + '7' + '2' + '2' + '2' + '5' + '4' + '0' + '1' + '2' + '4' + '4' + '6' + '>'} a new ${tweet?.is_quote_status ? `retweet` : `tweet`
						// 		} has been published <:AnePing:870804582039695440>`,
						// 	embeds: [
						// 		{
						// 			author: {
						// 				name: `${tweet?.user?.name + ` (@` + tweet?.user?.screen_name + `)`}`,
						// 				url: `https://twitter.com/${tweet?.user?.screen_name}`,
						// 				icon_url: tweet?.user?.profile_image_url,
						// 			},
						// 			thumbnail: {
						// 				url: tweet?.user?.profile_image_url?.replaceAll(`normal`, `bigger`),
						// 			},
						// 			image: {
						// 				url: tweet?.entities?.media?.[0]?.media_url_https ?? tweet?.entities?.media?.[0]?.media_url,
						// 			},
						// 			color: 13451365,
						// 			description: desc,
						// 		},
						// 	],
						// 	components: [
						// 		{
						// 			type: 1,
						// 			components: buttons,
						// 		},
						// 	],
						// }).then(() => Logger.log(`Tweet`, `Sent to #${channel?.name}.`, `yellow`));
						channel.send({
							content: `${tweet?.['i' + 's' + '_' + 'q' + 'u' + 'o' + 't' + 'e' + '_' + 's' + 't' + 'a' + 't' + 'u' + 's'] ? '' : '<@&1031605863556849714>'} a new ${tweet?.is_quote_status ? 'retweet' : 'tweet'} has been published <a:pinkgirlgifemoji:988478262516801546>\nhttps://fxtwitter.com/${tweet?.user?.screen_name}/status/${tweet?.id_str}`,
							components: [
								{
									type: 1,
									components: buttons,
								},
							],
						})

					} catch (error) {
						Logger.log(`Tweet`, `Failed to send to #${id}.`, `red`);
					}


				});

			}
		});
	});
};

async function formatDesc(client: any, text: string) {
	// you found a wrong person to fuck with
	let desc: string = ``;
	let rows: string[] = text?.split('\n');

	for await (let line of rows) {
		let array: string[] = line?.split(' ');

		let indexNumber: number = 0;
		for await (let x of array) {
			let tagCheck: RegExpMatchArray | null = x.match(/(\#[a-zA-Z0-9_%]*)/g);
			let userCheck: RegExpMatchArray | null = x.match(/(\@[a-zA-Z0-9_%]*)/g);
			let linkCheck: RegExpMatchArray | null = x?.match(/http(?:s)?:\/\/(?:www\.)?t\.co\/([a-zA-Z0-9_]+)/g);

			if (tagCheck) array[indexNumber] = x.replace(/(\#[a-zA-Z0-9_%]*)/g, `[${x}](https://twitter.com/hashtag/${x})`);
			if (userCheck) array[indexNumber] = x.replace(/(\@[a-zA-Z0-9_%]*)/g, `[${x}](https://twitter.com/${x})`);
			if (linkCheck) {
				await fetch(x, {
					redirect: 'follow',
					follow: 10,
				} as { redirect: 'follow'; follow: number })
					.then(async (response: any) => {
						let shortUrl = new URL(response?.url)?.hostname?.replace('www', '');
						if (shortUrl != `twitter.com`) {
							array[indexNumber] = x.replace(/http(?:s)?:\/\/(?:www\.)?t\.co\/([a-zA-Z0-9_]+)/g, `[${shortUrl}](${response?.url})`);
							await client?.wait?.(1000 * 2);
						} else {
							array[indexNumber] = ``;
						}
					})
					.catch(() => null);
			}

			indexNumber++;
		}

		desc += `> ` + (array?.length <= 1 ? array?.[0] : array?.join(' ')) + `\n`;
	}

	return desc != '0' ? desc : ``;
};
