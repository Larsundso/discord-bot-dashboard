/* eslint-disable @typescript-eslint/no-unused-vars */
import {
 GatewayDispatchEvents,
 type GatewayThreadCreateDispatchData,
 type GatewayThreadDeleteDispatchData,
 type GatewayThreadListSyncDispatchData,
 type GatewayThreadMembersUpdateDispatchData,
 type GatewayThreadMemberUpdateDispatchData,
 type GatewayThreadUpdateDispatchData,
} from 'discord-api-types/v10';
import RedisClient, { cache } from '../Redis.js';
import { publisher } from '../../Cluster/Redis.js';
import { CacheEvents } from '../../Cluster/Events.js';

export default {
 [GatewayDispatchEvents.ThreadCreate]: async (data: GatewayThreadCreateDispatchData) => {
  await cache.threads.set(undefined, data);

  publisher.publish(
   CacheEvents.threadCreate,
   JSON.stringify({ guild_id: data.guild_id, id: data.id }),
  );
 },

 [GatewayDispatchEvents.ThreadDelete]: async (data: GatewayThreadDeleteDispatchData) => {
  cache.threads.del(undefined, data.id);

  publisher.publish(
   CacheEvents.threadDelete,
   JSON.stringify({ guild_id: data.guild_id, id: data.id }),
  );

  const selectPipeline = RedisClient.pipeline();
  selectPipeline.hgetall(cache.threadMembers.keystore(data.guild_id));
  selectPipeline.hgetall(cache.messages.keystore(data.guild_id));
  const result = await selectPipeline.exec();
  if (!result) return;

  const [threadMembers, messages] = result;
  const deletePipeline = RedisClient.pipeline();

  deletePipeline.hdel(
   cache.threadMembers.keystore(data.guild_id),
   ...Object.keys(threadMembers).filter((m) => m.includes(data.id)),
  );
  deletePipeline.del(...Object.keys(threadMembers).filter((m) => m.includes(data.id)));

  deletePipeline.hdel(
   cache.messages.keystore(data.guild_id),
   ...Object.keys(messages).filter((m) => m.includes(data.id)),
  );
  deletePipeline.del(...Object.keys(messages).filter((m) => m.includes(data.id)));

  deletePipeline.exec();
 },

 [GatewayDispatchEvents.ThreadUpdate]: async (data: GatewayThreadUpdateDispatchData) => {
  await cache.threads.set(undefined, data);

  publisher.publish(
   CacheEvents.threadUpdate,
   JSON.stringify({ guild_id: data.guild_id, id: data.id }),
  );
 },

 [GatewayDispatchEvents.ThreadListSync]: (data: GatewayThreadListSyncDispatchData) => {
  data.threads.forEach((thread) =>
   cache.threads.set(undefined, { ...thread, guild_id: data.guild_id || thread.guild_id }),
  );

  data.members.forEach((threadMember) => {
   cache.threadMembers.set(undefined, threadMember, data.guild_id);

   if (!threadMember.member) return;
   cache.members.set(undefined, threadMember.member, data.guild_id);
  });
 },

 [GatewayDispatchEvents.ThreadMembersUpdate]: (data: GatewayThreadMembersUpdateDispatchData) => {
  data.added_members?.forEach((threadMember) => {
   cache.threadMembers.set(undefined, threadMember, data.guild_id);

   if (!threadMember.member) return;
   cache.members.set(undefined, threadMember.member, data.guild_id);
  });

  data.removed_member_ids?.forEach((id) => cache.threadMembers.del(undefined, data.id, id));

  publisher.publish(
   CacheEvents.threadMembersUpdate,
   JSON.stringify({
    guild_id: data.guild_id,
    id: data.id,
    added: data.added_members?.map((m) => m.id),
    removed: data.removed_member_ids,
   }),
  );
 },

 [GatewayDispatchEvents.ThreadMemberUpdate]: async (
  data: GatewayThreadMemberUpdateDispatchData,
 ) => {
  await cache.threadMembers.set(undefined, data, data.guild_id);

  publisher.publish(
   CacheEvents.threadMemberUpdate,
   JSON.stringify({ guild_id: data.guild_id, id: data.id, user_id: data.user_id }),
  );

  if (!data.member) return;
  cache.members.set(undefined, data.member, data.guild_id);
 },
} as const;
