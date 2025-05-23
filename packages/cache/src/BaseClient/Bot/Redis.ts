import Redis from 'ioredis';

import AutomodCache from './CacheManagers/automod.js';
import BanCache from './CacheManagers/ban.js';
import ChannelCache from './CacheManagers/channel.js';
import CommandCache from './CacheManagers/command.js';
import CommandPermissionCache from './CacheManagers/commandPermission.js';
import EmojiCache from './CacheManagers/emoji.js';
import EventCache from './CacheManagers/event.js';
import GuildCache from './CacheManagers/guild.js';
import GuildCommandCache from './CacheManagers/guildCommand.js';
import IntegrationCache from './CacheManagers/integration.js';
import InviteCache from './CacheManagers/invite.js';
import MemberCache from './CacheManagers/member.js';
import MessageCache from './CacheManagers/message.js';
import ReactionCache from './CacheManagers/reaction.js';
import RoleCache from './CacheManagers/role.js';
import SoundboardCache from './CacheManagers/soundboard.js';
import StageCache from './CacheManagers/stage.js';
import StickerCache from './CacheManagers/sticker.js';
import ThreadCache from './CacheManagers/thread.js';
import ThreadMemberCache from './CacheManagers/threadMember.js';
import UserCache from './CacheManagers/user.js';
import VoiceCache from './CacheManagers/voice.js';
import WebhookCache from './CacheManagers/webhook.js';

const redis = new Redis({ host: 'redis', db: 0 });
export default redis;

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
