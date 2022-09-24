import { ButtonInteraction, CommandInteraction, ContextMenuCommandInteraction } from 'discord.js';
import { Player } from 'erela.js';

export function getComponents(player: Player, disabled?: boolean) {
    function getVolumes() {
        let options: { label: string, value: string, emoji: string, default: boolean }[] = [];

        for (let i = 0; i <= 100; i=i+5) {
            options.push({
                label: i == player.volume ? `Current volume is at ${i}%` : ` Set volume to ${i}%`,
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
                    label: `Replay`,
                    emoji: `<:icons_update:860123644297871382>`,
                    custom_id: `replay_${player.voiceChannel}`,
                    disabled: disabled
                },
                {
                    type: 2,
                    style: 1,
                    label: `Skip`,
                    emoji: `<:icons_frontforward:988409335791124551>`,
                    custom_id: `skip_${player.voiceChannel}`,
                    disabled: disabled
                },
                
            ]
        },
        {
            type: 1,
            components: [
                {
                    type: 2,
                    style: 2,
                    label: `View Queue`,
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
                },
                {
                    type: 2,
                    style: 2,
                    label: `Move`,
                    emoji: `<:icons_downvote:911135418420953138>`,
                    custom_id: `movedown_${player.voiceChannel}`,
                    disabled: disabled
                }
            ]
        },
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

export async function checkConditions(client: any, interaction: CommandInteraction | ButtonInteraction | ContextMenuCommandInteraction | any, action: (`seek` | `pause` | `skip` | `previous` | `loop` | `shuffle` | `queue` | `volume` | `stop` | `replay`), playerId: string, volume?: number) {
    let player = client.players.list[playerId];

    if (interaction?.message?.id != client.players.messages[playerId]) {
        await interaction.message.delete().catch(() => null);
        return interaction.reply({ content: `This message has been expired and now deleted, [click here](https://discord.com/channels/${interaction?.guild?.id}/${player?.textChannel}/${client.players.messages[playerId]}) for latest one <:trol:1021007021455196170>`, ephemeral: true });
    } else if (!player) return interaction.reply({ content: `There is no music playing in this channel!`, ephemeral: true });
	else if (interaction?.member?.voice?.channel?.id !== player?.voiceChannel) return interaction.reply({ content: `You must be in the same voice channel as the bot to use this button!`, ephemeral: true });
	else if (!player.queue.previous && action == `previous`) return interaction.reply({ content: `There is no previous song to play!`, ephemeral: true });
	else {
		if (action != `queue`) interaction.deferUpdate().catch(() => null); manageMusic(client, interaction, player, action, volume);
	};
};

export async function manageMusic(client: any, interaction: CommandInteraction | ButtonInteraction | ContextMenuCommandInteraction | any, player: Player, action: (`seek` | `pause` | `skip` | `previous` | `loop` | `shuffle` | `queue` | `volume` | `stop` | `replay`), volume?: number) {
    let messageEdit: string = ``;
    switch (action) {
        case `pause`: {
            if (player.paused) {
                player.pause(false);
                messageEdit = `Resumed by ${interaction.member.user.tag}`;
            } else {
                player.pause(true); messageEdit = `Paused by ${interaction.member.user.tag}`;
            };

            break;
        };
        case `skip`: {
            if (volume) player.queue.splice(0, volume - 1); player.stop();
            messageEdit = `Skipped by ${interaction.member.user.tag}`;
        
            break;
        };
        case `previous`: {
            player.queue.unshift((player as any).queue.previous); player.stop();
            messageEdit = `Previous song by ${interaction.member.user.tag}`;

            break;
        };
        case `loop`: {
            if (player.trackRepeat) {
                player.setTrackRepeat(false);
                messageEdit = `Loop toggled off by ${interaction.member.user.tag}`;
            } else {
                player.setTrackRepeat(true);
                messageEdit = `Loop toggled on by ${interaction.member.user.tag}`;
            };

            break;
        };
        case `shuffle`: {
            player.queue.shuffle();
            messageEdit = `Shuffled queue by ${interaction.member.user.tag}`;

            break;
        };
        case `queue`: {
            for (let i = 0; i < player.queue.length; i++) {
                const song = player.queue[i]; messageEdit += `**${i + 1}.** • [${song.title?.length > 30 ? song.title?.slice(0, 30) : song.title}](${song.uri}) • [${client.formatTime(song.duration, true)}] • ${song.requester}\n`;
            };

            if (messageEdit.length > 4000) messageEdit = messageEdit.slice(0, 4000);

            break;
        };
        case `volume`: {
            player.setVolume(volume ?? 70);
            messageEdit = `Volume changed by ${interaction.member.user.tag}`;

            break;
        };
        case `stop`: {
            player.stop();
            messageEdit = `Stopped by ${interaction.member.user.tag}`;

            break;
        };
        case `replay`: {
            player.seek(0);
            messageEdit = `Replayed by ${interaction.member.user.tag}`;

            break;
        };
        case `seek`: {
            if (volume && volume > 0 && volume < (player?.queue?.current?.duration ?? 0)) player.seek(volume);
            else return interaction.editReply({ content: `You must provide a valid number between 0 and ${client.parseTime(player?.queue?.current?.duration ?? 0, true)}!`, ephemeral: true });
            messageEdit = `Seeked by ${interaction.member.user.tag} to ${client.parseTime(volume, true)}.`;

            break;
        };
    };

    if (action == `pause` || action == `skip` || action == `previous` || action == `loop` || action == `shuffle` || action == `volume`) {
        let message = client.channels.cache.get(player.textChannel)?.messages.cache.get(client.players.messages[(player as any).voiceChannel]);

        message?.edit({
            embeds: [
                {
                    color: 15447957,
                    image: {
                        url: `https://cdn.crni.xyz/r/invisible.png`
                    },
                    description: `> Currently playing [${(player as any)?.queue?.current?.title?.length > 40 ? `${player?.queue?.current?.title?.slice(0, 40)}..` : player?.queue?.current?.title}](${player?.queue?.current?.uri})..\n> It's duration is ${player?.queue?.current?.isStream ? `infinite` : `${client.formatTime(player?.queue?.current?.duration)}`}.`,
                    footer: {
                        text: messageEdit,
                        iconURL: interaction.member.user.displayAvatarURL()
                    }
                }
            ],
            components: getComponents(player),
        }).catch(() => null);
    } else if (action == `queue`) {
        interaction.reply({
            ephemeral: true,
            embeds: [
                {
                    color: 15447957,
                    description: messageEdit,
                    image: {
                        url: `https://cdn.crni.xyz/r/invisible.png`
                    },
                }
            ],
        }).catch(() => {
            interaction.editReply({
                embeds: [
                    {
                        color: 15447957,
                        description: messageEdit,
                        image: {
                            url: `https://cdn.crni.xyz/r/invisible.png`
                        },
                    }
                ],
            }).catch(() => null);
        });
    };
};