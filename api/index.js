const { request, response } = require('express');
const client = require('../app');

module.exports = [{
    path: '/',
    method: 'get',
    /**
     * 
     * @param {request} req 
     * @param {response} res 
     */
    run: async (req, res) => {

        const forceLuna = await client.users.fetch(`821472922140803112`, { force: true });
        const luna = await (await client.guilds.cache.get(`828676951023550495`))?.members.fetch(`821472922140803112`);

        if (!luna?.user?.id || !forceLuna?.id) return res.status(500).json({
            status: 500,
            message: `Cannot fetch Luna`
        });

        let color = `#747F8D`
        switch (luna.presence?.status) {
            case `online`: { color = `#57F287`; break; }
            case `dnd`: { color = `#ED4245`; break; }
            case `idle`: { color = `#FEE75C`; break; }
        };

        let emote, text;
        if (luna.presence?.activities.find(activitie => activitie.type === `CUSTOM`)) {
            const status = await luna.presence?.activities.find(activitie => activitie.type === `CUSTOM`);
            if (status.emoji?.id) emote = `https://cdn.discordapp.com/emojis/${status.emoji.id}.${status.emoji.animated ? `gif` : `png`}?size=2048`;
            if (status.state) text = status.state;
        };
        let status = { state: { text: luna.presence?.status, color: color }, emote: emote, text: text };

        let activities = [];
        if (luna.presence?.activities.filter(activitie => activitie.type === `PLAYING`)) {
            acts = await luna.presence?.activities.filter(activitie => activitie.type === `PLAYING`);
            acts?.forEach((activitie) => {
                if (activitie.name !== `ShareX`)
                    activities.push({
                        applicationId: activitie.applicationId,
                        name: activitie.name,
                        url: activitie.url,
                        details: activitie.details,
                        state: activitie.state,
                        createdTimestamp: activitie.createdTimestamp,
                        timestamps: {
                            start: activitie.timestamps?.start ? new Date(activitie.timestamps?.start).getTime() : null,
                            end: activitie.timestamps?.end ? new Date(activitie.timestamps?.end).getTime() : null
                        },
                        assets: {
                            large: {
                                text: activitie.assets?.largeText,
                                image: activitie.assets?.largeImage ? (activitie.assets.largeImage.startsWith(`mp:external`) ? `https://media.discordapp.net/${activitie.assets.largeImage.replace(/mp:/, ``)}` : `https://cdn.discordapp.com/app-assets/${activitie.applicationId}/${activitie.assets.largeImage}.png`) : null
                            },
                            small: {
                                text: activitie.assets?.smallText,
                                image: activitie.assets?.smallImage ? (activitie.assets.smallImage.startsWith(`mp:external`) ? `https://media.discordapp.net/${activitie.assets.smallImage.replace(/mp:/, ``)}` : `https://cdn.discordapp.com/app-assets/${activitie.applicationId}/${activitie.assets.smallImage}.png`) : null
                            }
                        }
                    });
            });
        };

        return res.status(200).json({
            status: 200,
            message: `OK`,
            content: {
                id: luna.user.id,
                username: luna.user.username,
                discriminator: luna.user.discriminator,
                nickname: luna.nickanme ? (luna.nickanme || luna.user.username) : `Luna`,
                nickavatar: luna.avatar ? `https://cdn.discordapp.com/guilds/${luna.guild.id}/users/${luna.id}/avatars/${luna.avatar}.${luna.avatar?.startsWith(`a_`) ? `gif` : `png`}?size=2048` : null,
                status: status,
                activities: activities,
                createdTimestamp: luna.user.createdTimestamp,
                avatar: luna.user.avatar ? `https://cdn.discordapp.com/avatars/${luna.user.id}/${luna.user.avatar}.${luna.user.avatar?.startsWith('a_') ? 'gif' : 'png'}?size=2048` : null,
                banner: forceLuna.banner ? `https://cdn.discordapp.com/banners/${luna.user.id}/${forceLuna.banner}.${forceLuna.banner?.startsWith('a_') ? 'gif' : 'png'}?size=600` : null,
                accentColor: `#${parseInt(forceLuna.accentColor, 10).toString(16)}`
            }
        });

    }
}];