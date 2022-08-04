import { ButtonObject } from '../json/typings';
import Logger from '../functions/logger';
import Twit from 'node-tweet-stream';

export default async (client: any) => {
    const twitterClient: any = new Twit({
        consumer_key: client?.config?.twitter?.twitterConsumerKey,
        consumer_secret: client?.config?.twitter?.twitterConsumerSecret,
        token: client?.config?.twitter?.twitterAccessTokenKey,
        token_secret: client?.config?.twitter?.twitterAccessTokenSecret
    });

    twitterClient.on('tweet', async (tweet: any) => {
        if (tweet?.in_reply_to_screen_name) return;

        client?.config?.twitter?.users?.forEach(async (user: { id: string, name: string }) => {
            if (tweet.user.id == user.id && tweet.user.screen_name == user.name) {

                let buttons: ButtonObject[] = [{
                    type: 2,
                    style: 5,
                    label: `Tweet`,
                    emoji: `<a:c_pridestar:932368163264430120>`,
                    url: `https://twitter.com/${tweet?.user?.screen_name}/status/${tweet?.id_str}`
                }];

                if (tweet?.is_quote_status) {
                    buttons.push({
                        type: 2,
                        style: 5,
                        label: `Original Post`,
                        emoji: `<a:c_prideflag:932368173494304849>`,
                        url: tweet?.quoted_status_permalink?.expanded
                    });

                    tweet.entities.media = tweet?.quoted_status?.entities?.media
                };

                let desc: (string | null) = await formatDesc(client, tweet?.text); // don't blame me lmao

                client?.config?.twitter?.channels?.forEach((id: any) => {
                    let channel: any = client?.channels?.cache?.get(id); // just no, ffs
                    channel?.send({
                        content: `<@&953992722254012446> a new ${tweet?.is_quote_status ? `retweet` : `tweet`} has been published <a:Nod:952226993921998859>`,
                        embeds: [{
                            author: {
                                name: `${(tweet?.user?.name) + ` (@` + tweet?.user?.screen_name + `)`}`,
                                url: `https://twitter.com/${tweet?.user?.screen_name}`,
                                icon_url: tweet?.user?.profile_image_url
                            },
                            thumbnail: {
                                url: tweet?.user?.profile_image_url?.replaceAll(`normal`, `bigger`)
                            },
                            image: {
                                url: tweet?.entities?.media?.[0]?.media_url_https
                            },
                            color: `#cd4065`,
                            description: desc,
                        }],
                        components: [{
                            type: 1,
                            components: buttons
                        }]
                    }).then(() => Logger.log(`Tweet`, `Sent to #${channel?.name}.`, `yellow`)).catch(() => null);
                });
            };
        });
    });

    client.twitterClient = twitterClient;
};

async function formatDesc(client: any, text: string) { // you found a wrong person to fuck with
    let desc: string = ``;
    let rows: string[] = text?.split('\n');

    let i: number = 0; for await (let line of rows) {
        i++;

        let array: string[] = line?.split(' ');

        let j: number = 0; for await (let x of array) {
            j++;

            let tagCheck: (RegExpMatchArray | null) = x.match(/(\@[a-zA-Z0-9_%]*)/g);
            let linkCheck: (RegExpMatchArray | null) = x?.match(/http(?:s)?:\/\/(?:www\.)?t\.co\/([a-zA-Z0-9_]+)/g);

            if (tagCheck) array[j] = x.replace((/(\@[a-zA-Z0-9_%]*)/g), `[${x}](https://twitter.com/${x})`);
            if (linkCheck) {
                await fetch(x, {
                    redirect: 'follow',
                    follow: 10,
                } as { redirect: 'follow', follow: number }).then(async (response: any) => {
                    let shortUrl = new URL(response?.url)?.hostname?.replace('www', '');
                    if (shortUrl != `twitter.com`) {
                        array[j] = x.replace((/http(?:s)?:\/\/(?:www\.)?t\.co\/([a-zA-Z0-9_]+)/g), `[${shortUrl}](${response?.url})`); // regex will broke sometimes (rarely), idc
                        await client?.wait?.(1000 * 2);
                    } else {
                        array[j] = ``; // love it
                    };
                }).catch(() => null);
            };
        };

        desc += (`> ` + (array?.length <= 1 ? array?.[0] : array?.join(' ')) + `\n`);
    };
    
    return (desc != '0' ? desc : ``);
};