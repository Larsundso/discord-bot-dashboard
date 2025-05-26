import type { RChannelTypes } from './CacheManagers/channel.js';
import { cache as redis } from './Redis.js';
import {
 ChannelType,
 GatewayDispatchEvents,
 type APIGuildChannel,
 type APIThreadChannel,
 type GatewayApplicationCommandPermissionsUpdateDispatchData,
 type GatewayDispatchPayload,
 type GatewayGuildSoundboardSoundsUpdateDispatchData,
 type GatewayInteractionCreateDispatchData,
 type GatewayPresenceUpdateDispatchData,
 type GatewayReadyDispatchData,
 type GatewayResumedDispatch,
 type GatewayTypingStartDispatchData,
 type GatewayUserUpdateDispatchData,
 type GatewayWebhooksUpdateDispatchData,
} from 'discord-api-types/v10';

import AutoModeration from './CacheEvents/AutoModeration.js';
import Channel from './CacheEvents/Channels.js';
import Entitlements from './CacheEvents/Entitlements.js';
import Guilds from './CacheEvents/Guilds.js';
import Integration from './CacheEvents/Integrations.js';
import Invite from './CacheEvents/Invites.js';
import Message from './CacheEvents/Messages.js';
import Stage from './CacheEvents/Stages.js';
import Subscription from './CacheEvents/Subscriptions.js';
import Thread from './CacheEvents/Threads.js';
import Voice from './CacheEvents/Voice.js';

export const GuildTextChannelTypes = [
 ChannelType.AnnouncementThread,
 ChannelType.GuildAnnouncement,
 ChannelType.GuildStageVoice,
 ChannelType.GuildText,
 ChannelType.GuildVoice,
 ChannelType.PrivateThread,
 ChannelType.PublicThread,
];

export const AllNonThreadGuildChannelTypes = [
 ChannelType.GuildAnnouncement,
 ChannelType.GuildStageVoice,
 ChannelType.GuildText,
 ChannelType.GuildVoice,
 ChannelType.GuildForum,
 ChannelType.GuildMedia,
];

export const AllThreadGuildChannelTypes = [
 ChannelType.PublicThread,
 ChannelType.PrivateThread,
 ChannelType.AnnouncementThread,
];

export default async (data: GatewayDispatchPayload) => {
 const cache = caches[data.t];
 if (!cache) return;

 cache(data.d as Parameters<typeof cache>[0]);
};

const caches: Record<GatewayDispatchEvents, (data: never) => unknown> = {
 ...AutoModeration,
 ...Channel,
 ...Entitlements,
 ...Guilds,
 ...Integration,
 ...Invite,
 ...Message,
 ...Stage,
 ...Thread,
 ...Voice,
 ...Subscription,

 [GatewayDispatchEvents.ApplicationCommandPermissionsUpdate]: (
  data: GatewayApplicationCommandPermissionsUpdateDispatchData,
 ) => data.permissions.forEach((p) => redis.commandPermissions.set(undefined, p, data.guild_id)),

 [GatewayDispatchEvents.SoundboardSounds]: (data: GatewayGuildSoundboardSoundsUpdateDispatchData) =>
  data.soundboard_sounds.forEach((sound) =>
   redis.soundboards.set(undefined, { ...sound, guild_id: data.guild_id || sound.guild_id }),
  ),

 [GatewayDispatchEvents.InteractionCreate]: (data: GatewayInteractionCreateDispatchData) => {
  if (data.user) redis.users.set(undefined, data.user);

  if (data.message && data.guild_id) {
   redis.messages.set(undefined, data.message, (data.guild_id || data.guild?.id)!);
  }

  if (!data.channel || !data.guild_id) return;

  if (AllThreadGuildChannelTypes.includes(data.channel.type)) {
   redis.threads.set(undefined, {
    ...(data.channel as APIThreadChannel),
    guild_id: (data.channel as APIThreadChannel).guild_id || data.guild_id,
   });
   return;
  }

  if (!AllNonThreadGuildChannelTypes.includes(data.channel.type)) return;

  redis.channels.set(undefined, {
   ...(data.channel as APIGuildChannel<RChannelTypes>),
   guild_id: data.guild_id || (data.channel as APIGuildChannel<RChannelTypes>).guild_id,
  });
 },

 [GatewayDispatchEvents.UserUpdate]: (data: GatewayUserUpdateDispatchData) =>
  redis.users.set(undefined, data),

 [GatewayDispatchEvents.WebhooksUpdate]: (_: GatewayWebhooksUpdateDispatchData) => undefined,

 [GatewayDispatchEvents.TypingStart]: (data: GatewayTypingStartDispatchData) => {
  if (!data.member || !data.guild_id) return;

  redis.members.set(undefined, data.member, data.guild_id);
 },

 [GatewayDispatchEvents.Ready]: (data: GatewayReadyDispatchData) =>
  redis.users.set(undefined, data.user),

 [GatewayDispatchEvents.Resumed]: (_: GatewayResumedDispatch['d']) => undefined,

 [GatewayDispatchEvents.PresenceUpdate]: (_: GatewayPresenceUpdateDispatchData) => undefined,
};
