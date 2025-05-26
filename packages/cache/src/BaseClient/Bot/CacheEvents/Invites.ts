/* eslint-disable @typescript-eslint/no-unused-vars */
import {
 GatewayDispatchEvents,
 GuildNSFWLevel,
 GuildVerificationLevel,
 InviteType,
 type GatewayInviteCreateDispatchData,
 type GatewayInviteDeleteDispatchData,
} from 'discord-api-types/v10';
import { cache as redis } from '../Redis.js';
import { publisher } from '../../Cluster/Redis.js';
import { CacheEvents, type Message } from '../../Cluster/Events.js';

export default {
 [GatewayDispatchEvents.InviteCreate]: (data: GatewayInviteCreateDispatchData) => {
  if (data.inviter) redis.users.set(undefined, data.inviter);

  if (data.target_user) redis.users.set(undefined, data.target_user);

  if (data.guild_id) {
   redis.invites.set(undefined, {
    ...data,
    type: InviteType.Guild,
    guild: {
     id: data.guild_id,
     banner: null,
     description: null,
     features: [],
     icon: null,
     name: 'Unknown Guild',
     nsfw_level: GuildNSFWLevel.Default,
     splash: null,
     vanity_url_code: null,
     verification_level: GuildVerificationLevel.None,
    },
    inviter: data.inviter,
    target_user: data.target_user,
    guild_scheduled_event: undefined,
    stage_instance: undefined,
    channel: null,
   });
  }

  const payload = { guild_id: data.guild_id, code: data.code };
  publisher.publish(
   CacheEvents.inviteCreate,
   JSON.stringify(payload as Message<CacheEvents.inviteCreate>),
  );
 },

 [GatewayDispatchEvents.InviteDelete]: async (data: GatewayInviteDeleteDispatchData) => {
  await redis.invites.del(undefined, data.code);

  const payload = { guild_id: data.guild_id, code: data.code };
  publisher.publish(
   CacheEvents.inviteDelete,
   JSON.stringify(payload as Message<CacheEvents.inviteDelete>),
  );
 },
} as const;
