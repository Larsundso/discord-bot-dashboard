/* eslint-disable @typescript-eslint/no-unused-vars */
import {
 GatewayDispatchEvents,
 type GatewayChannelCreateDispatchData,
 type GatewayChannelDeleteDispatchData,
 type GatewayChannelPinsUpdateDispatchData,
 type GatewayChannelUpdateDispatchData,
} from 'discord-api-types/v10';
import RedisClient, { cache as redis } from '../Redis.js';
import { publisher } from '../../Cluster/Redis.js';
import { CacheEvents, type Message } from '../../Cluster/Events.js';

export default {
 [GatewayDispatchEvents.ChannelCreate]: async (data: GatewayChannelCreateDispatchData) => {
  await redis.channels.set(data);
  const payload = { id: data.id, guild_id: data.guild_id };
  publisher.publish(
   CacheEvents.channelCreate,
   JSON.stringify(payload as Message<CacheEvents.channelCreate>),
  );
 },

 [GatewayDispatchEvents.ChannelDelete]: async (data: GatewayChannelDeleteDispatchData) => {
  await redis.channels.del(data.id);
  const payload = { id: data.id, guild_id: data.guild_id };
  publisher.publish(
   CacheEvents.channelDelete,
   JSON.stringify(payload as Message<CacheEvents.channelDelete>),
  );

  const pipeline = RedisClient.pipeline();
  const messages = await RedisClient.hgetall(redis.messages.keystore(data.guild_id));

  pipeline.hdel(
   redis.messages.keystore(data.guild_id),
   ...Object.keys(messages).filter((m) => m.includes(data.id)),
  );
  pipeline.del(...Object.keys(messages).filter((m) => m.includes(data.id)));
  pipeline.exec();
 },

 [GatewayDispatchEvents.ChannelPinsUpdate]: (data: GatewayChannelPinsUpdateDispatchData) => {
  const payload = { channel_id: data.channel_id, guild_id: data.guild_id };
  publisher.publish(
   CacheEvents.channelPinsUpdate,
   JSON.stringify(payload as Message<CacheEvents.channelPinsUpdate>),
  );
 },

 [GatewayDispatchEvents.ChannelUpdate]: async (data: GatewayChannelUpdateDispatchData) => {
  await redis.channels.set(data);
  const payload = { id: data.id, guild_id: data.guild_id };
  publisher.publish(
   CacheEvents.channelUpdate,
   JSON.stringify(payload as Message<CacheEvents.channelUpdate>),
  );
 },
} as const;
