export default async function(content: string) {
    const urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    const urls = content.match(urlRegex);

    let data: { success: boolean, buttons: any[] } = { success: true, buttons: [] };
    
    if (urls) {
        let response = await fetch(`https://api.song.link/v1-alpha.1/links?url=${urls[0]}`).then(async (res) => res = await res.json()).catch(() => null);
        if (!response) data.success = false;
        else {
            let platformData: { type: string, county: string, url: string, entityUniqueId: string, nativeAppUriDesktop?: string, nativeAppUriMobile?: string }[] = Object.keys(response.linksByPlatform).map((key) => { return { type: key, ...response.linksByPlatform[key] }; });

            platformData.map((platform) => {
                switch (platform.type) {
                    case 'youtube':
                        data.buttons.push({ type: 2, label: 'YouTube', url: platform.url, emoji: `<:youtube:1022839192369242192>`, style: 5 });
                        break;
                    case 'spotify':
                        data.buttons.push({ type: 2, label: 'Spotify', url: platform.url, emoji: `<:spotify:1022839191035461692>`, style: 5 });
                        break;
                    case 'itunes':
                        data.buttons.push({ type: 2, label: 'iTunes', url: platform.url, emoji: `<:imusic:1022839189424853042>`, style: 5 });
                        break;
                    case 'deezer':
                        data.buttons.push({ type: 2, label: 'Deezer', url: platform.url, emoji: `<:deezer:1022839186467864576>`, style: 5 });
                        break;
                    case 'soundcloud':
                        data.buttons.push({ type: 2, label: 'SoundCloud', url: platform.url, emoji: `<:soundcloud:1022839187591938149>`, style: 5 });
                        break;
                };
            });
        };
    } else {
        data.success = false;
    };

    return data;
};