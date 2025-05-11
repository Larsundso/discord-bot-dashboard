/* eslint-disable @typescript-eslint/no-unused-vars */
import {
 GatewayDispatchEvents,
 type GatewayMessageCreateDispatchData,
 type GatewayMessageDeleteBulkDispatchData,
 type GatewayMessageDeleteDispatchData,
 type GatewayMessagePollVoteDispatchData,
 type GatewayMessageReactionAddDispatchData,
 type GatewayMessageReactionRemoveAllDispatchData,
 type GatewayMessageReactionRemoveDispatchData,
 type GatewayMessageReactionRemoveEmojiDispatchData,
 type GatewayMessageUpdateDispatchData,
} from 'discord-api-types/v10';
import RedisClient, { cache as redis } from '../Redis.js';
import { publisher } from '../../Cluster/Redis.js';
import { CacheEvents, type Message } from '../../Cluster/Events.js';

export default {
 [GatewayDispatchEvents.MessageCreate]: async (data: GatewayMessageCreateDispatchData) => {
  if (data.guild_id) redis.messages.set(data, data.guild_id);

  if (!data.webhook_id) redis.users.set(data.author);

  const cache = await redis.threads.get(data.channel_id);
  if (cache) redis.threads.set({ ...cache, message_count: (cache.message_count || 0) + 1 });

  const payload = { guild_id: data.guild_id, channel_id: data.channel_id, id: data.id };
  publisher.publish(
   CacheEvents.messageCreate,
   JSON.stringify(payload as Message<CacheEvents.messageCreate>),
  );
 },

 [GatewayDispatchEvents.MessageDelete]: async (data: GatewayMessageDeleteDispatchData) => {
  await redis.messages.del(data.id);

  const payload = {
   guild_id: data.guild_id,
   channel_id: data.channel_id,
   id: data.id,
  };
  publisher.publish(
   CacheEvents.messageDelete,
   JSON.stringify(payload as Message<CacheEvents.messageDelete>),
  );
 },

 [GatewayDispatchEvents.MessageDeleteBulk]: async (data: GatewayMessageDeleteBulkDispatchData) => {
  data.ids.forEach((id) => redis.messages.del(id));

  const payload = {
   guild_id: data.guild_id,
   channel_id: data.channel_id,
   ids: data.ids,
  };
  publisher.publish(
   CacheEvents.messageDeleteBulk,
   JSON.stringify(payload as Message<CacheEvents.messageDeleteBulk>),
  );
 },

 [GatewayDispatchEvents.MessageUpdate]: async (data: GatewayMessageUpdateDispatchData) => {
  if (!data.guild_id) return;

  await redis.messages.set(data, data.guild_id);

  const payload = {
   guild_id: data.guild_id,
   channel_id: data.channel_id,
   id: data.id,
  };
  publisher.publish(
   CacheEvents.messageUpdate,
   JSON.stringify(payload as Message<CacheEvents.messageUpdate>),
  );
 },

 [GatewayDispatchEvents.MessagePollVoteAdd]: (_: GatewayMessagePollVoteDispatchData) => undefined,

 [GatewayDispatchEvents.MessagePollVoteRemove]: (_: GatewayMessagePollVoteDispatchData) =>
  undefined,

 [GatewayDispatchEvents.MessageReactionAdd]: async (
  data: GatewayMessageReactionAddDispatchData,
 ) => {
  if (data.member && data.guild_id) redis.members.set(data.member, data.guild_id);

  if (data.member?.user) redis.users.set(data.member.user);

  const payload = {
   guild_id: data.guild_id,
   channel_id: data.channel_id,
   id: data.message_id,
   reaction: data.emoji.id || data.emoji.name,
  };
  publisher.publish(
   CacheEvents.messageReactionAdd,
   JSON.stringify(payload as Message<CacheEvents.messageReactionAdd>),
  );

  if (!data.guild_id) return;

  const cache = await redis.reactions.get(data.message_id, (data.emoji.id || data.emoji.name)!);

  redis.reactions.set(
   {
    burst_colors: data.burst_colors,
    emoji: data.emoji,
    me: cache?.me || false,
    count_details: cache?.count_details
     ? {
        burst: cache.count_details.burst + (data.burst ? 1 : 0),
        normal: cache.count_details.normal + (data.burst ? 0 : 1),
       }
     : { burst: data.burst ? 1 : 0, normal: data.burst ? 0 : 1 },
    count: cache?.count ? cache.count + 1 : 1,
    me_burst: cache?.me_burst || data.user_id === process.env.mainId ? data.burst : false,
   },
   data.guild_id,
   data.channel_id,
   data.message_id,
  );
 },

 [GatewayDispatchEvents.MessageReactionRemove]: async (
  data: GatewayMessageReactionRemoveDispatchData,
 ) => {
  const payload = {
   guild_id: data.guild_id,
   channel_id: data.channel_id,
   id: data.message_id,
   reaction: data.emoji.id || data.emoji.name,
  };
  publisher.publish(
   CacheEvents.messageReactionRemove,
   JSON.stringify(payload as Message<CacheEvents.messageReactionRemove>),
  );

  if (!data.guild_id) return;

  const cache = await redis.reactions.get(data.message_id, (data.emoji.id || data.emoji.name)!);

  redis.reactions.set(
   {
    burst_colors: cache?.burst_colors || [],
    emoji: data.emoji,
    me: cache?.me || false,
    count_details: cache?.count_details
     ? {
        burst: cache.count_details.burst - (data.burst ? 1 : 0),
        normal: cache.count_details.normal - (data.burst ? 0 : 1),
       }
     : { burst: 0, normal: 0 },
    count: cache?.count ? cache.count - 1 : 0,
    me_burst: cache?.me_burst || data.user_id === process.env.mainId ? data.burst : false,
   },
   data.guild_id,
   data.channel_id,
   data.message_id,
  );
 },

 [GatewayDispatchEvents.MessageReactionRemoveAll]: (
  data: GatewayMessageReactionRemoveAllDispatchData,
 ) => {
  const pipeline = RedisClient.pipeline();
  const reactions = RedisClient.hgetall(redis.reactions.keystore(data.message_id));
  pipeline.hdel(
   redis.reactions.keystore(data.message_id),
   ...Object.keys(reactions).filter((r) => r.includes(data.message_id)),
  );
  pipeline.del(...Object.keys(reactions).filter((r) => r.includes(data.message_id)));
  pipeline.exec();

  const payload = {
   guild_id: data.guild_id,
   channel_id: data.channel_id,
   id: data.message_id,
  };
  publisher.publish(
   CacheEvents.messageReactionRemoveAll,
   JSON.stringify(payload as Message<CacheEvents.messageReactionRemoveAll>),
  );
 },

 [GatewayDispatchEvents.MessageReactionRemoveEmoji]: async (
  data: GatewayMessageReactionRemoveEmojiDispatchData,
 ) => {
  const payload = {
   guild_id: data.guild_id,
   channel_id: data.channel_id,
   id: data.message_id,
   emoji: data.emoji.id || data.emoji.name,
  };
  publisher.publish(
   CacheEvents.messageReactionRemoveEmoji,
   JSON.stringify(payload as Message<CacheEvents.messageReactionRemoveEmoji>),
  );

  if (!data.guild_id) return;

  const pipeline = RedisClient.pipeline();
  const reactions = await RedisClient.hgetall(redis.reactions.keystore(data.guild_id));
  const filteredReactions = Object.keys(reactions).filter(
   (r) => r.includes(data.message_id) && r.includes((data.emoji.id || data.emoji.name)!),
  );

  pipeline.hdel(redis.reactions.keystore(data.guild_id), ...filteredReactions);
  pipeline.del(...filteredReactions);
  pipeline.exec();
 },
} as const;
