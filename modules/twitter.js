const { start, log } = require(`../functions/logger`);
const Twit = require("node-tweet-stream");

module.exports = async (client) => {
    const twitterClient = new Twit({
        consumer_key: client.twitter.twitterConsumerKey,
        consumer_secret: client.twitter.twitterConsumerSecret,
        token: client.twitter.twitterAccessTokenKey,
        token_secret: client.twitter.twitterAccessTokenSecret
    });

    twitterClient.on('tweet', async function (tweet) {
        if (tweet?.in_reply_to_screen_name) return;

        client.twitter.users.forEach(async (user) => {
            if (tweet.user.id == user.id && tweet.user.screen_name == user.name) {

                let buttons = [{
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

                let desc = await formatDesc(client, tweet?.text); // don't blame me lmao

                client.twitter.channels.forEach((channel) => {
                    client.channels.cache.get(channel)?.send({
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
                    }).then((msg) => log(`Tweet`, `Sent to #${msg.channel.name}.`, `yellow`)).catch(() => null);
                });
            };
        });
    });

    client.twitterClient = twitterClient;
};

async function formatDesc(client, text) {
    if (!text) return '';
    let desc = ``;
    let rows = text?.split('\n');

    rows?.forEach(async (line, i) => {
        let array = line?.split(' ');
        array?.forEach(async (x, j) => {
            let tagCheck = x.match(/(\@[a-zA-Z0-9_%]*)/g);
            let linkCheck = x?.match(/http(?:s)?:\/\/(?:www\.)?t\.co\/([a-zA-Z0-9_]+)/g);

            if (tagCheck) array[j] = x.replace((/(\@[a-zA-Z0-9_%]*)/g), `[${x}](https://twitter.com/${x})`);
            if (linkCheck) {
                await fetch(x, {
                    redirect: 'follow',
                    follow: 10,
                }).then(async (response) => {
                    let shortUrl = new URL(response?.url)?.hostname?.replace('www', '');
                    if (shortUrl != `twitter.com`) {
                        array[j] = x.replace((/http(?:s)?:\/\/(?:www\.)?t\.co\/([a-zA-Z0-9_]+)/g), `[${shortUrl}](${response?.url})`); // regex will broke sometimes (rarely), idc
                        await client.wait(1000 * 2);
                    } else {
                        array[j] = ``; // love it
                    };
                }).catch(() => null);
            };
        });

        await client.wait(2000 * 5);
        desc += (`> ` + (array?.length <= 1 ? array?.[0] : array?.join(' ')) + `\n`);
    });

    await client.wait(2200 * (((text?.split('\n')?.length + text?.split(' ')?.length) < 4 ? 5 : (text?.split('\n')?.length + text?.split(' ')?.length))) + 2200); // this will delay a loot sometimes, also idc
    return (desc != 0 ? desc : null);
};