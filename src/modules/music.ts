import { Player } from 'erela.js';

export function getComponents(player: Player, disabled?: boolean) {
    function getVolumes() {
        let options: { label: string, value: string, emoji: string, default: boolean }[] = [];

        for (let i = 0; i <= 100; i=i+5) {
            options.push({
                label: `${i}%`,
                value: `${i}`,
                emoji: `<:icons_enable:866599434866786324>`,
                default: i == player.volume ? true : false
            });
        };

        return options;
    };

    let components = [
        {
            type: 1,
            components: [
                {
                    type: 3,
                    custom_id: `volume_menu_${player.voiceChannel}`,
                    placeholder: `Select volume level (0-100)`,
                    disabled: disabled,
                    options: getVolumes()
                }
            ]
        },
        {
            type: 1,
            components: [
                {
                    type: 2,
                    style: 1,
                    label: `Previous`,
                    emoji: `<:icons_backforward:988409328698523708>`,
                    custom_id: `previous_${player.voiceChannel}`,
                    disabled: disabled
                },
                {
                    type: 2,
                    style: 1,
                    label: player?.paused ? `Resume` : `Pause`,
                    emoji: player?.paused ? `<:icons_play:861852632800952320>` : `<:icons_play:988409341784768533>`,
                    custom_id: `pause_${player.voiceChannel}`,
                    disabled: disabled
                },
                {
                    type: 2,
                    style: 1,
                    label: `Stop`,
                    emoji: `<:icons_musicstop:861852633979420712>`,
                    custom_id: `stop_${player.voiceChannel}`,
                    disabled: disabled
                },
                {
                    type: 2,
                    style: 1,
                    label: `Skip`,
                    emoji: `<:icons_frontforward:988409335791124551>`,
                    custom_id: `skip_${player.voiceChannel}`,
                    disabled: disabled
                }
            ]
        },
        {
            type: 1,
            components: [
                {
                    type: 2,
                    style: 2,
                    label: `Queue`,
                    emoji: `<:icons_queue:861852633240961024>`,
                    custom_id: `queue_${player.voiceChannel}`,
                    disabled: disabled
                },
                {
                    type: 2,
                    style: 2,
                    label: player?.trackRepeat ? `Loop On` : `Loop Off`,
                    emoji: `<:icons_loop:861852632893227029>`,
                    custom_id: `loop_${player.voiceChannel}`,
                    disabled: disabled
                },
                {
                    type: 2,
                    style: 2,
                    label: `Shuffle`,
                    emoji: `<:icons_music:860123644201271326>`,
                    custom_id: `shuffle_${player.voiceChannel}`,
                    disabled: disabled
                }
            ]
        }
    ];

    return components;
};

export async function findPlatforms(content: string) {
    const urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    const urls = content.match(urlRegex);

    let data: { success: boolean, buttons: any[] } = { success: true, buttons: [] };
    
    if (urls) {
        let response = await fetch(`https://api.song.link/v1-alpha.1/links?url=${urls[0]}`).then(async (res) => res = await res.json()).catch(() => null);
        if (!response) data.success = false;
        else {
            let platformData: { type: string, county: string, url: string, entityUniqueId: string, nativeAppUriDesktop?: string, nativeAppUriMobile?: string }[] = Object.keys(response.linksByPlatform)?.map((key) => { return { type: key, ...response.linksByPlatform[key] }; })?.reverse();
            
            platformData.map((platform) => {
                switch (platform.type) {
                    case `youtube`:
                        data.buttons.push({ type: 2, label: `YouTube`, url: platform.url, emoji: `<:youtube:1022839192369242192>`, style: 5 });
                        break;
                    case `spotify`:
                        data.buttons.push({ type: 2, label: `Spotify`, url: platform.url, emoji: `<:spotify:1022839191035461692>`, style: 5 });
                        break;
                    case `itunes`:
                        data.buttons.push({ type: 2, label: `iTunes`, url: platform.url, emoji: `<:imusic:1022839189424853042>`, style: 5 });
                        break;
                    case `deezer`:
                        data.buttons.push({ type: 2, label: `Deezer`, url: platform.url, emoji: `<:deezer:1022839186467864576>`, style: 5 });
                        break;
                    case `soundcloud`:
                        data.buttons.push({ type: 2, label: `SoundCloud`, url: platform.url, emoji: `<:soundcloud:1022839187591938149>`, style: 5 });
                        break;
                };
            });
        };
    } else {
        data.success = false;
    };

    return data;
};

export async function pauseSong(client: any, interaction: any, player: Player) {
    if (player.paused) {
        player.pause(false);
        
        client.channels.cache.get(player.textChannel)?.messages.cache.get(client.players.messages[(player as any).voiceChannel])?.edit({
            embeds: [
	    		{
	    			color: 15447957,
	    			image: {
                        url: `https://cdn.crni.xyz/r/invisible.png`
                    },
	    			description: `> Currently playing [${(player as any)?.queue?.current?.title?.length > 40 ? `${player?.queue?.current?.title?.slice(0, 40)}..` : player?.queue?.current?.title}](${player?.queue?.current?.uri})..\n> It's duration is ${player?.queue?.current?.isStream ? `infinite` : `${client.formatTime(player?.queue?.current?.duration)}`}.`,
                    footer: {
                        text: `Resumed by ${interaction.member.user.tag}`,
                        iconURL: interaction.member.user.displayAvatarURL()
                    }
	    		}
	    	],
            components: getComponents(player),
        });
    } else {
        player.pause(true);

        client.channels.cache.get(player.textChannel)?.messages.cache.get(client.players.messages[(player as any).voiceChannel])?.edit({
            embeds: [
	    		{
	    			color: 15447957,
	    			image: {
                        url: `https://cdn.crni.xyz/r/invisible.png`
                    },
	    			description: `> Currently playing [${(player as any)?.queue?.current?.title?.length > 40 ? `${player?.queue?.current?.title?.slice(0, 40)}..` : player?.queue?.current?.title}](${player?.queue?.current?.uri}).\n> It's duration is ${player?.queue?.current?.isStream ? `infinite` : `${client.formatTime(player?.queue?.current?.duration)}`}.`,
                    footer: {
                        text: `Paused by ${interaction.member.user.tag}`,
                        iconURL: interaction.member.user.displayAvatarURL()
                    }
	    		}
	    	],
            components: getComponents(player),
        });
    };
};

export async function volumeSet(client: any, interaction: any, player: Player) {
    player.setVolume(interaction.values[0]);

    client.channels.cache.get(player.textChannel)?.messages.cache.get(client.players.messages[(player as any).voiceChannel])?.edit({
        embeds: [
            {
                color: 15447957,
                image: {
                    url: `https://cdn.crni.xyz/r/invisible.png`
                },
                description: `> Currently playing [${(player as any)?.queue?.current?.title?.length > 40 ? `${player?.queue?.current?.title?.slice(0, 40)}..` : player?.queue?.current?.title}](${player?.queue?.current?.uri})..\n> It's duration is ${player?.queue?.current?.isStream ? `infinite` : `${client.formatTime(player?.queue?.current?.duration)}`}.`,
                footer: {
                    text: `Volume changed by ${interaction.member.user.tag}`,
                    iconURL: interaction.member.user.displayAvatarURL()
                }
            }
        ],
        components: getComponents(player),
    });
};

export async function skipSong(client: any, interaction: any, player: Player) {
    player.stop();

    client.channels.cache.get(player.textChannel)?.messages.cache.get(client.players.messages[(player as any).voiceChannel])?.edit({
        embeds: [
            {
                color: 15447957,
                image: {
                    url: `https://cdn.crni.xyz/r/invisible.png`
                },
                description: `> Currently playing [${(player as any)?.queue?.current?.title?.length > 40 ? `${player?.queue?.current?.title?.slice(0, 40)}..` : player?.queue?.current?.title}](${player?.queue?.current?.uri})..\n> It's duration is ${player?.queue?.current?.isStream ? `infinite` : `${client.formatTime(player?.queue?.current?.duration)}`}.`,
                footer: {
                    text: `Skipped by ${interaction.member.user.tag}`,
                    iconURL: interaction.member.user.displayAvatarURL()
                }
            }
        ],
        components: getComponents(player),
    });
};

export async function previousSong(client: any, interaction: any, player: Player) {
    player.queue.unshift((player as any).queue.previous); player.stop();

    client.channels.cache.get(player.textChannel)?.messages.cache.get(client.players.messages[(player as any).voiceChannel])?.edit({
        embeds: [
            {
                color: 15447957,
                image: {
                    url: `https://cdn.crni.xyz/r/invisible.png`
                },
                description: `> Currently playing [${(player as any)?.queue?.current?.title?.length > 40 ? `${player?.queue?.current?.title?.slice(0, 40)}..` : player?.queue?.current?.title}](${player?.queue?.current?.uri})..\n> It's duration is ${player?.queue?.current?.isStream ? `infinite` : `${client.formatTime(player?.queue?.current?.duration)}`}.`,
                footer: {
                    text: `Previous song by ${interaction.member.user.tag}`,
                    iconURL: interaction.member.user.displayAvatarURL()
                }
            }
        ],
        components: getComponents(player),
    });
};

export async function loopToggle(client: any, interaction: any, player: Player) {
    if (player.trackRepeat) {
        player.setTrackRepeat(false);

        client.channels.cache.get(player.textChannel)?.messages.cache.get(client.players.messages[(player as any).voiceChannel])?.edit({
            embeds: [
                {
                    color: 15447957,
                    image: {
                        url: `https://cdn.crni.xyz/r/invisible.png`
                    },
                    description: `> Currently playing [${(player as any)?.queue?.current?.title?.length > 40 ? `${player?.queue?.current?.title?.slice(0, 40)}..` : player?.queue?.current?.title}](${player?.queue?.current?.uri})..\n> It's duration is ${player?.queue?.current?.isStream ? `infinite` : `${client.formatTime(player?.queue?.current?.duration)}`}.`,
                    footer: {
                        text: `Loop toggled off by ${interaction.member.user.tag}`,
                        iconURL: interaction.member.user.displayAvatarURL()
                    }
                }
            ],
            components: getComponents(player),
        });
    } else {
        player.setTrackRepeat(true);

        client.channels.cache.get(player.textChannel)?.messages.cache.get(client.players.messages[(player as any).voiceChannel])?.edit({
            embeds: [
                {
                    color: 15447957,
                    image: {
                        url: `https://cdn.crni.xyz/r/invisible.png`
                    },
                    description: `> Currently playing [${(player as any)?.queue?.current?.title?.length > 40 ? `${player?.queue?.current?.title?.slice(0, 40)}..` : player?.queue?.current?.title}](${player?.queue?.current?.uri})..\n> It's duration is ${player?.queue?.current?.isStream ? `infinite` : `${client.formatTime(player?.queue?.current?.duration)}`}.`,
                    footer: {
                        text: `Loop toggled on by ${interaction.member.user.tag}`,
                        iconURL: interaction.member.user.displayAvatarURL()
                    }
                }
            ],
            components: getComponents(player),
        });
    };
};

export async function shuffleToggle(client: any, interaction: any, player: Player) {
    player.queue.shuffle();

    client.channels.cache.get(player.textChannel)?.messages.cache.get(client.players.messages[(player as any).voiceChannel])?.edit({
        embeds: [
            {
                color: 15447957,
                image: {
                    url: `https://cdn.crni.xyz/r/invisible.png`
                },
                description: `> Currently playing [${(player as any)?.queue?.current?.title?.length > 40 ? `${player?.queue?.current?.title?.slice(0, 40)}..` : player?.queue?.current?.title}](${player?.queue?.current?.uri})..\n> It's duration is ${player?.queue?.current?.isStream ? `infinite` : `${client.formatTime(player?.queue?.current?.duration)}`}.`,
                footer: {
                    text: `Shuffled queue by ${interaction.member.user.tag}`,
                    iconURL: interaction.member.user.displayAvatarURL()
                }
            }
        ],
        components: getComponents(player),
    });
};

export async function queue(client: any, interaction: any, player: Player) {
    let songStrings: string = ``; for (let i = 0; i < player.queue.length; i++) {
        const song = player.queue[i]; songStrings += `**${i + 1}.** • [${song.title?.length > 30 ? song.title?.slice(0, 30) : song.title}](${song.uri}) • [${client.formatTime(song.duration, true)}] • ${song.requester}\n`;
    };

    interaction.reply({
        ephemeral: true,
        embeds: [
            {
                color: 15447957,
                image: {
                    url: `https://cdn.crni.xyz/r/invisible.png`
                },
                description: songStrings,
            }
        ],
    });
};