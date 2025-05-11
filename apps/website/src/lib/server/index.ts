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

export const api = new API(
	new REST({ version: '10', api: 'http://127.0.0.1:8080/api' }).setToken(VALIDATOR_TOKEN),
);
export const publisher = new Redis({ host: '127.0.0.1', db: 0 });
export const redis = publisher;
export const subscriber = new Redis({ db: 0, host: '127.0.0.1' });

subscriber.subscribe(...Object.values(CacheEvents), (err, count) => {
	if (err) throw err;
	console.log(`Subscribed to ${count} channels.`);
	console.log(`Available Cache: ${Object.values(CacheEvents).length}`);
});

subscriber.on('message', (channel, message) => {
	console.log(channel, message);
});

export const cache = {
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
