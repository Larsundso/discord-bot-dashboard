import { VALIDATOR_TOKEN } from '$env/static/private';
import { CacheEvents } from '@discord-bot-dashboard/cache/src/BaseClient/Cluster/Events.js';
import { API } from '@discordjs/core';
import { REST } from '@discordjs/rest';
import { Redis } from 'ioredis';

import AutomodCache from '@discord-bot-dashboard/cache/src/BaseClient/Bot/CacheManagers/automod';
import BanCache from '@discord-bot-dashboard/cache/src/BaseClient/Bot/CacheManagers/ban';
import ChannelCache from '@discord-bot-dashboard/cache/src/BaseClient/Bot/CacheManagers/channel';
import CommandCache from '@discord-bot-dashboard/cache/src/BaseClient/Bot/CacheManagers/command';
import CommandPermissionCache from '@discord-bot-dashboard/cache/src/BaseClient/Bot/CacheManagers/commandPermission';
import EmojiCache from '@discord-bot-dashboard/cache/src/BaseClient/Bot/CacheManagers/emoji';
import EventCache from '@discord-bot-dashboard/cache/src/BaseClient/Bot/CacheManagers/event';
import GuildCache from '@discord-bot-dashboard/cache/src/BaseClient/Bot/CacheManagers/guild';
import GuildCommandCache from '@discord-bot-dashboard/cache/src/BaseClient/Bot/CacheManagers/guildCommand';
import IntegrationCache from '@discord-bot-dashboard/cache/src/BaseClient/Bot/CacheManagers/integration';
import InviteCache from '@discord-bot-dashboard/cache/src/BaseClient/Bot/CacheManagers/invite';
import MemberCache from '@discord-bot-dashboard/cache/src/BaseClient/Bot/CacheManagers/member';
import MessageCache from '@discord-bot-dashboard/cache/src/BaseClient/Bot/CacheManagers/message';
import ReactionCache from '@discord-bot-dashboard/cache/src/BaseClient/Bot/CacheManagers/reaction';
import RoleCache from '@discord-bot-dashboard/cache/src/BaseClient/Bot/CacheManagers/role';
import SoundboardCache from '@discord-bot-dashboard/cache/src/BaseClient/Bot/CacheManagers/soundboard';
import StageCache from '@discord-bot-dashboard/cache/src/BaseClient/Bot/CacheManagers/stage';
import StickerCache from '@discord-bot-dashboard/cache/src/BaseClient/Bot/CacheManagers/sticker';
import ThreadCache from '@discord-bot-dashboard/cache/src/BaseClient/Bot/CacheManagers/thread';
import ThreadMemberCache from '@discord-bot-dashboard/cache/src/BaseClient/Bot/CacheManagers/threadMember';
import UserCache from '@discord-bot-dashboard/cache/src/BaseClient/Bot/CacheManagers/user';
import VoiceCache from '@discord-bot-dashboard/cache/src/BaseClient/Bot/CacheManagers/voice';
import WebhookCache from '@discord-bot-dashboard/cache/src/BaseClient/Bot/CacheManagers/webhook';

import { type Emitter } from 'sveltekit-sse';
import guildCreate from './Events/guildCreate';
import guildDelete from './Events/guildDelete';
import guildUpdate from './Events/guildUpdate';
import messageCreate from './Events/messageCreate';
import messageDelete from './Events/messageDelete';
import messageUpdate from './Events/messageUpdate';

export const validatorAPI = new API(
	new REST({ version: '10', api: 'http://nirn:8080/api' }).setToken(VALIDATOR_TOKEN),
);

export let api: typeof validatorAPI;
export const setAPI = (token: string) => {
	api = new API(new REST({ version: '10', api: 'http://nirn:8080/api' }).setToken(token));
};

export const publisher = new Redis({ host: 'redis', db: 0 });
export const redis = publisher;
export const subscriber = new Redis({ db: 0, host: 'redis' });

const savedToken = await redis.get('token');
if (savedToken) setAPI(savedToken);

subscriber.subscribe(...Object.values(CacheEvents), (err, count) => {
	if (err) throw err;
	console.log(`Subscribed to ${count} channels.`);
	console.log(`Available Cache: ${Object.values(CacheEvents).length}`);
});

const channelFnMap: Record<CacheEvents, (_1: typeof cache, _2: string) => void> = {
	[CacheEvents.channelCreate]: (_1, _2) => {},
	[CacheEvents.channelDelete]: (_1, _2) => {},
	[CacheEvents.channelPinsUpdate]: (_1, _2) => {},
	[CacheEvents.channelUpdate]: (_1, _2) => {},
	[CacheEvents.emojiCreate]: (_1, _2) => {},
	[CacheEvents.emojiDelete]: (_1, _2) => {},
	[CacheEvents.emojiUpdate]: (_1, _2) => {},
	[CacheEvents.guildAvailable]: (_1, _2) => {},
	[CacheEvents.guildAuditLogEntryCreate]: (_1, _2) => {},
	[CacheEvents.guildCreate]: guildCreate,
	[CacheEvents.guildDelete]: guildDelete,
	[CacheEvents.guildMemberAdd]: (_1, _2) => {},
	[CacheEvents.guildMemberRemove]: (_1, _2) => {},
	[CacheEvents.guildMemberUpdate]: (_1, _2) => {},
	[CacheEvents.guildRoleCreate]: (_1, _2) => {},
	[CacheEvents.guildRoleDelete]: (_1, _2) => {},
	[CacheEvents.guildRoleUpdate]: (_1, _2) => {},
	[CacheEvents.guildScheduledEventCreate]: (_1, _2) => {},
	[CacheEvents.guildScheduledEventDelete]: (_1, _2) => {},
	[CacheEvents.guildScheduledEventUpdate]: (_1, _2) => {},
	[CacheEvents.guildSoundboardSoundCreate]: (_1, _2) => {},
	[CacheEvents.guildSoundboardSoundDelete]: (_1, _2) => {},
	[CacheEvents.guildSoundboardSoundUpdate]: (_1, _2) => {},
	[CacheEvents.guildUnavailable]: (_1, _2) => {},
	[CacheEvents.guildUpdate]: guildUpdate,
	[CacheEvents.inviteCreate]: (_1, _2) => {},
	[CacheEvents.inviteDelete]: (_1, _2) => {},
	[CacheEvents.messageCreate]: messageCreate,
	[CacheEvents.messageDelete]: messageDelete,
	[CacheEvents.messageDeleteBulk]: (_1, _2) => {},
	[CacheEvents.messageReactionAdd]: (_1, _2) => {},
	[CacheEvents.messageReactionRemove]: (_1, _2) => {},
	[CacheEvents.messageReactionRemoveAll]: (_1, _2) => {},
	[CacheEvents.messageReactionRemoveEmoji]: (_1, _2) => {},
	[CacheEvents.messageUpdate]: messageUpdate,
	[CacheEvents.presenceUpdate]: (_1, _2) => {},
	[CacheEvents.soundboardSounds]: (_1, _2) => {},
	[CacheEvents.stageInstanceCreate]: (_1, _2) => {},
	[CacheEvents.stageInstanceDelete]: (_1, _2) => {},
	[CacheEvents.stageInstanceUpdate]: (_1, _2) => {},
	[CacheEvents.stickersUpdate]: (_1, _2) => {},
	[CacheEvents.threadCreate]: (_1, _2) => {},
	[CacheEvents.threadDelete]: (_1, _2) => {},
	[CacheEvents.threadMembersUpdate]: (_1, _2) => {},
	[CacheEvents.threadMemberUpdate]: (_1, _2) => {},
	[CacheEvents.threadUpdate]: (_1, _2) => {},
	[CacheEvents.typingStart]: (_1, _2) => {},
	[CacheEvents.userUpdate]: (_1, _2) => {},
	[CacheEvents.voiceStateUpdate]: (_1, _2) => {},
	[CacheEvents.webhooksUpdate]: (_1, _2) => {},
};

subscriber.on('message', (channel: CacheEvents, message) => {
	channelFnMap[channel]?.(cache, message);
});

const redisCache = {
	automods: new AutomodCache(redis),
	bans: new BanCache(redis),
	channels: new ChannelCache(redis),
	commands: new CommandCache(redis),
	commandPermissions: new CommandPermissionCache(redis),
	emojis: new EmojiCache(redis),
	events: new EventCache(redis),
	guilds: new GuildCache(redis),
	guildCommands: new GuildCommandCache(redis),
	integrations: new IntegrationCache(redis),
	invites: new InviteCache(redis),
	members: new MemberCache(redis),
	messages: new MessageCache(redis),
	reactions: new ReactionCache(redis),
	roles: new RoleCache(redis),
	soundboards: new SoundboardCache(redis),
	stages: new StageCache(redis),
	stickers: new StickerCache(redis),
	threads: new ThreadCache(redis),
	threadMembers: new ThreadMemberCache(redis),
	users: new UserCache(redis),
	voices: new VoiceCache(redis),
	webhooks: new WebhookCache(redis),
};

export const cache: typeof redisCache & {
	listeners: Emitter[];
} = {
	...redisCache,
	listeners: [],
};
