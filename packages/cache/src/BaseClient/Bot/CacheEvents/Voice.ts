/* eslint-disable @typescript-eslint/no-unused-vars */
import {
 GatewayDispatchEvents,
 type GatewayVoiceChannelEffectSendDispatchData,
 type GatewayVoiceServerUpdateDispatchData,
 type GatewayVoiceStateUpdateDispatchData,
} from 'discord-api-types/v10';
import { cache as redis } from '../Redis.js';
import { publisher } from '../../Cluster/Redis.js';
import { CacheEvents } from '../../Cluster/Events.js';

export default {
 [GatewayDispatchEvents.VoiceChannelEffectSend]: (_: GatewayVoiceChannelEffectSendDispatchData) =>
  undefined,

 [GatewayDispatchEvents.VoiceServerUpdate]: (_: GatewayVoiceServerUpdateDispatchData) => undefined,

 [GatewayDispatchEvents.VoiceStateUpdate]: async (data: GatewayVoiceStateUpdateDispatchData) => {
  await redis.voices.set(undefined, data);

  publisher.publish(
   CacheEvents.threadMemberUpdate,
   JSON.stringify({ guild_id: data.guild_id, id: data.user_id }),
  );
 },
} as const;
