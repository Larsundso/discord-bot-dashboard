/* eslint-disable @typescript-eslint/no-unused-vars */
import {
 GatewayDispatchEvents,
 type GatewayStageInstanceCreateDispatchData,
 type GatewayStageInstanceDeleteDispatchData,
 type GatewayStageInstanceUpdateDispatchData,
} from 'discord-api-types/v10';
import { cache as redis } from '../Redis.js';
import { publisher } from '../../Cluster/Redis.js';
import { CacheEvents } from '../../Cluster/Events.js';

export default {
 [GatewayDispatchEvents.StageInstanceCreate]: async (
  data: GatewayStageInstanceCreateDispatchData,
 ) => {
  await redis.stages.set(undefined, data);

  publisher.publish(
   CacheEvents.stageInstanceCreate,
   JSON.stringify({ guild_id: data.guild_id, id: data.id, channel_id: data.channel_id }),
  );
 },

 [GatewayDispatchEvents.StageInstanceDelete]: async (
  data: GatewayStageInstanceDeleteDispatchData,
 ) => {
  await redis.stages.del(undefined, data.id);

  publisher.publish(
   CacheEvents.stageInstanceDelete,
   JSON.stringify({ guild_id: data.guild_id, id: data.id, channel_id: data.channel_id }),
  );
 },

 [GatewayDispatchEvents.StageInstanceUpdate]: async (
  data: GatewayStageInstanceUpdateDispatchData,
 ) => {
  await redis.stages.set(undefined, data);

  publisher.publish(
   CacheEvents.stageInstanceUpdate,
   JSON.stringify({ guild_id: data.guild_id, id: data.id, channel_id: data.channel_id }),
  );
 },
} as const;
