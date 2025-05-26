/* eslint-disable @typescript-eslint/no-unused-vars */
import {
 GatewayDispatchEvents,
 type APIGuildMember,
 type GatewayGuildAuditLogEntryCreateDispatchData,
 type GatewayGuildBanAddDispatchData,
 type GatewayGuildBanRemoveDispatchData,
 type GatewayGuildCreateDispatchData,
 type GatewayGuildDeleteDispatchData,
 type GatewayGuildEmojisUpdateDispatchData,
 type GatewayGuildIntegrationsUpdateDispatchData,
 type GatewayGuildMemberAddDispatchData,
 type GatewayGuildMemberRemoveDispatchData,
 type GatewayGuildMembersChunkDispatchData,
 type GatewayGuildMemberUpdateDispatchData,
 type GatewayGuildRoleCreateDispatchData,
 type GatewayGuildScheduledEventCreateDispatchData,
 type GatewayGuildScheduledEventDeleteDispatchData,
 type GatewayGuildScheduledEventUpdateDispatchData,
 type GatewayGuildScheduledEventUserAddDispatchData,
 type GatewayGuildScheduledEventUserRemoveDispatchData,
 type GatewayGuildSoundboardSoundCreateDispatchData,
 type GatewayGuildSoundboardSoundDeleteDispatchData,
 type GatewayGuildSoundboardSoundsUpdateDispatchData,
 type GatewayGuildSoundboardSoundUpdateDispatchData,
 type GatewayGuildStickersUpdateDispatchData,
 type GatewayGuildUpdateDispatchData,
} from 'discord-api-types/v10';
import { GuildMemberFlagsBitField } from 'discord.js';
import { CacheEvents, type Message } from '../../Cluster/Events.js';
import { publisher } from '../../Cluster/Redis.js';
import RedisClient, { cache as redis } from '../Redis.js';

export default {
 [GatewayDispatchEvents.GuildAuditLogEntryCreate]: async (
  data: GatewayGuildAuditLogEntryCreateDispatchData,
 ) => {
  const payload = { id: data.id, guild_id: data.guild_id };
  publisher.publish(
   CacheEvents.guildAuditLogEntryCreate,
   JSON.stringify(payload as Message<CacheEvents.guildAuditLogEntryCreate>),
  );
 },

 [GatewayDispatchEvents.GuildBanAdd]: (data: GatewayGuildBanAddDispatchData) => {
  redis.bans.set(undefined, { reason: '-', user: data.user }, data.guild_id);
  redis.users.set(undefined, data.user);
 },

 [GatewayDispatchEvents.GuildBanRemove]: (data: GatewayGuildBanRemoveDispatchData) => {
  redis.bans.del(undefined, data.guild_id, data.user.id);
  redis.users.set(undefined, data.user);
 },

 [GatewayDispatchEvents.GuildCreate]: async (data: GatewayGuildCreateDispatchData) => {
  if (data.unavailable) return;
  if ('geo_restricted' in data && data.geo_restricted) return;

  console.log('guild create', data.id);
  console.log(data.channels.length, 'channels');

  const pipeline = RedisClient.pipeline();
  redis.guilds.set(pipeline, data);
  await Promise.all(
   data.soundboard_sounds.map((sound) =>
    redis.soundboards.set(pipeline, { ...sound, guild_id: data.id }),
   ),
  );
  await Promise.all(data.emojis.map((emoji) => redis.emojis.set(pipeline, emoji, data.id)));
  await Promise.all(
   data.threads.map((thread) => redis.threads.set(pipeline, { ...thread, guild_id: data.id })),
  );
  await Promise.all(data.guild_scheduled_events.map((event) => redis.events.set(pipeline, event)));
  await Promise.all(data.roles.map((role) => redis.roles.set(pipeline, role, data.id)));
  await Promise.all(data.members.map((member) => redis.members.set(pipeline, member, data.id)));
  await Promise.all(data.members.map((member) => redis.users.set(pipeline, member.user)));
  await Promise.all(
   data.voice_states.map((voice) => redis.voices.set(pipeline, { ...voice, guild_id: data.id })),
  );
  await Promise.all(
   data.channels.map((channel) => redis.channels.set(pipeline, { ...channel, guild_id: data.id })),
  );
  await Promise.all(
   data.stickers.map((sticker) => redis.stickers.set(pipeline, { ...sticker, guild_id: data.id })),
  );
  pipeline.exec();

  publisher.publish(
   CacheEvents.guildCreate,
   JSON.stringify({ id: data.id } as Message<CacheEvents.guildCreate>),
  );
 },

 [GatewayDispatchEvents.GuildDelete]: async (data: GatewayGuildDeleteDispatchData) => {
  const getPipeline = RedisClient.pipeline();

  getPipeline.hgetall(redis.automods.keystore(data.id));
  getPipeline.hgetall(redis.bans.keystore(data.id));
  getPipeline.hgetall(redis.channels.keystore(data.id));
  getPipeline.hgetall(redis.commandPermissions.keystore(data.id));
  getPipeline.hgetall(redis.emojis.keystore(data.id));
  getPipeline.hgetall(redis.events.keystore(data.id));
  getPipeline.hgetall(redis.guildCommands.keystore(data.id));
  getPipeline.hgetall(redis.integrations.keystore(data.id));
  getPipeline.hgetall(redis.invites.keystore(data.id));
  getPipeline.hgetall(redis.members.keystore(data.id));
  getPipeline.hgetall(redis.messages.keystore(data.id));
  getPipeline.hgetall(redis.reactions.keystore(data.id));
  getPipeline.hgetall(redis.roles.keystore(data.id));
  getPipeline.hgetall(redis.soundboards.keystore(data.id));
  getPipeline.hgetall(redis.stages.keystore(data.id));
  getPipeline.hgetall(redis.stickers.keystore(data.id));
  getPipeline.hgetall(redis.threads.keystore(data.id));
  getPipeline.hgetall(redis.threadMembers.keystore(data.id));
  getPipeline.hgetall(redis.voices.keystore(data.id));
  getPipeline.hgetall(redis.webhooks.keystore(data.id));

  const results = await getPipeline.exec();
  if (!results) return;

  const [
   automods,
   bans,
   channels,
   commandPermissions,
   emojis,
   events,
   guildCommands,
   integrations,
   invites,
   members,
   messages,
   reactions,
   roles,
   soundboards,
   stages,
   stickers,
   threads,
   threadMembers,
   voices,
   webhooks,
  ] = results.map((result) => result[1] || {});

  const deletePipeline = RedisClient.pipeline();
  deletePipeline.del(redis.guilds.keystore(data.id));
  deletePipeline.del(redis.automods.keystore(data.id));
  deletePipeline.del(redis.bans.keystore(data.id));
  deletePipeline.del(redis.channels.keystore(data.id));
  deletePipeline.del(redis.commandPermissions.keystore(data.id));
  deletePipeline.del(redis.emojis.keystore(data.id));
  deletePipeline.del(redis.events.keystore(data.id));
  deletePipeline.del(redis.guildCommands.keystore(data.id));
  deletePipeline.del(redis.integrations.keystore(data.id));
  deletePipeline.del(redis.invites.keystore(data.id));
  deletePipeline.del(redis.members.keystore(data.id));
  deletePipeline.del(redis.messages.keystore(data.id));
  deletePipeline.del(redis.reactions.keystore(data.id));
  deletePipeline.del(redis.roles.keystore(data.id));
  deletePipeline.del(redis.soundboards.keystore(data.id));
  deletePipeline.del(redis.stages.keystore(data.id));
  deletePipeline.del(redis.stickers.keystore(data.id));
  deletePipeline.del(redis.threads.keystore(data.id));
  deletePipeline.del(redis.threadMembers.keystore(data.id));
  deletePipeline.del(redis.voices.keystore(data.id));
  deletePipeline.del(redis.webhooks.keystore(data.id));

  deletePipeline.del(...Object.keys(automods));
  deletePipeline.del(...Object.keys(bans));
  deletePipeline.del(...Object.keys(channels));
  deletePipeline.del(...Object.keys(commandPermissions));
  deletePipeline.del(...Object.keys(emojis));
  deletePipeline.del(...Object.keys(events));
  deletePipeline.del(...Object.keys(guildCommands));
  deletePipeline.del(...Object.keys(integrations));
  deletePipeline.del(...Object.keys(invites));
  deletePipeline.del(...Object.keys(members));
  deletePipeline.del(...Object.keys(messages));
  deletePipeline.del(...Object.keys(reactions));
  deletePipeline.del(...Object.keys(roles));
  deletePipeline.del(...Object.keys(soundboards));
  deletePipeline.del(...Object.keys(stages));
  deletePipeline.del(...Object.keys(stickers));
  deletePipeline.del(...Object.keys(threads));
  deletePipeline.del(...Object.keys(threadMembers));
  deletePipeline.del(...Object.keys(voices));
  deletePipeline.del(...Object.keys(webhooks));

  await deletePipeline.exec();
  publisher.publish(
   CacheEvents.guildDelete,
   JSON.stringify({ id: data.id } as Message<CacheEvents.guildDelete>),
  );
 },

 [GatewayDispatchEvents.GuildUpdate]: async (data: GatewayGuildUpdateDispatchData) => {
  await redis.guilds.set(undefined, data);
  publisher.publish(
   CacheEvents.guildUpdate,
   JSON.stringify({ id: data.id } as Message<CacheEvents.guildUpdate>),
  );
 },

 [GatewayDispatchEvents.GuildEmojisUpdate]: async (data: GatewayGuildEmojisUpdateDispatchData) => {
  const emojis = await RedisClient.hgetall(redis.emojis.keystore(data.guild_id));

  const pipeline = RedisClient.pipeline();
  pipeline.del(...Object.keys(emojis));
  pipeline.del(redis.stickers.keystore(data.guild_id));
  await Promise.all(data.emojis.map((emoji) => redis.emojis.set(pipeline, emoji, data.guild_id)));
  await pipeline.exec();

  publisher.publish(
   CacheEvents.emojiUpdate,
   JSON.stringify({ guild_id: data.guild_id } as Message<CacheEvents.emojiUpdate>),
  );
 },

 [GatewayDispatchEvents.GuildIntegrationsUpdate]: (_: GatewayGuildIntegrationsUpdateDispatchData) =>
  undefined,

 [GatewayDispatchEvents.GuildMemberAdd]: async (data: GatewayGuildMemberAddDispatchData) => {
  await redis.members.set(undefined, data, data.guild_id);
  await redis.users.set(undefined, data.user);

  const payload = { guild_id: data.guild_id, user_id: data.user.id };
  publisher.publish(
   CacheEvents.guildMemberAdd,
   JSON.stringify(payload as Message<CacheEvents.guildMemberAdd>),
  );
 },

 [GatewayDispatchEvents.GuildMemberRemove]: async (data: GatewayGuildMemberRemoveDispatchData) => {
  await redis.members.del(undefined, data.guild_id, data.user.id);
  await redis.users.set(undefined, data.user);

  const payload = { guild_id: data.guild_id, user_id: data.user.id };
  publisher.publish(
   CacheEvents.guildMemberRemove,
   JSON.stringify(payload as Message<CacheEvents.guildMemberRemove>),
  );
 },

 [GatewayDispatchEvents.GuildMembersChunk]: async (data: GatewayGuildMembersChunkDispatchData) => {
  console.log('chunk received', data.guild_id);

  const pipeline = RedisClient.pipeline();
  await Promise.all(
   data.members
    .map((member) => [
     redis.members.set(pipeline, member, data.guild_id),
     redis.users.set(pipeline, member.user),
    ])
    .flat(),
  );

  pipeline.exec().then(console.log);
 },

 [GatewayDispatchEvents.GuildMemberUpdate]: async (data: GatewayGuildMemberUpdateDispatchData) => {
  if (data.joined_at && data.deaf && data.mute) {
   redis.members.set(undefined, data as Parameters<typeof redis.members.set>[1], data.guild_id);
   return;
  }

  const member = await RedisClient.get(
   `${redis.members.key()}:${data.guild_id}:${data.user.id}`,
  ).then((r) => (r ? (JSON.parse(r) as APIGuildMember) : null));
  if (!member) {
   redis.members.set(
    undefined,
    {
     ...data,
     joined_at: data.joined_at || new Date().toISOString(),
     mute: data.mute || false,
     deaf: data.deaf || false,
     flags: data.flags || new GuildMemberFlagsBitField().bitfield,
    },
    data.guild_id,
   );
   return;
  }

  const mergedMember = { ...data };

  if (!data.user) return;
  redis.members.set(
   undefined,
   {
    ...mergedMember,
    deaf: mergedMember.deaf || false,
    mute: mergedMember.mute || false,
    flags: mergedMember.flags || new GuildMemberFlagsBitField().bitfield,
    joined_at: mergedMember.joined_at || new Date().toISOString(),
   },
   data.guild_id,
  );

  const payload = { guild_id: data.guild_id, user_id: data.user.id };
  publisher.publish(
   CacheEvents.guildMemberUpdate,
   JSON.stringify(payload as Message<CacheEvents.guildMemberUpdate>),
  );
 },

 [GatewayDispatchEvents.GuildRoleCreate]: async (data: GatewayGuildRoleCreateDispatchData) => {
  await redis.roles.set(undefined, data.role, data.guild_id);
  const payload = { guild_id: data.guild_id, role_id: data.role.id };
  publisher.publish(
   CacheEvents.guildRoleCreate,
   JSON.stringify(payload as Message<CacheEvents.guildRoleCreate>),
  );
 },

 [GatewayDispatchEvents.GuildRoleDelete]: async (data: GatewayGuildRoleCreateDispatchData) => {
  if (!data.role) return;
  await redis.roles.del(undefined, data.role.id);

  const payload = { guild_id: data.guild_id, role_id: data.role.id };
  publisher.publish(
   CacheEvents.guildRoleDelete,
   JSON.stringify(payload as Message<CacheEvents.guildRoleDelete>),
  );
 },

 [GatewayDispatchEvents.GuildRoleUpdate]: async (data: GatewayGuildRoleCreateDispatchData) => {
  await redis.roles.set(undefined, data.role, data.guild_id);

  const payload = { guild_id: data.guild_id, role_id: data.role.id };
  publisher.publish(
   CacheEvents.guildRoleUpdate,
   JSON.stringify(payload as Message<CacheEvents.guildRoleUpdate>),
  );
 },

 [GatewayDispatchEvents.GuildScheduledEventCreate]: async (
  data: GatewayGuildScheduledEventCreateDispatchData,
 ) => {
  await redis.events.set(undefined, data);

  const payload = { guild_id: data.guild_id, event_id: data.id };
  publisher.publish(
   CacheEvents.guildScheduledEventCreate,
   JSON.stringify(payload as Message<CacheEvents.guildScheduledEventCreate>),
  );
 },

 [GatewayDispatchEvents.GuildScheduledEventDelete]: async (
  data: GatewayGuildScheduledEventDeleteDispatchData,
 ) => {
  await redis.events.del(undefined, data.id);

  const payload = { guild_id: data.guild_id, event_id: data.id };
  publisher.publish(
   CacheEvents.guildScheduledEventDelete,
   JSON.stringify(payload as Message<CacheEvents.guildScheduledEventDelete>),
  );
 },

 [GatewayDispatchEvents.GuildScheduledEventUpdate]: async (
  data: GatewayGuildScheduledEventUpdateDispatchData,
 ) => {
  await redis.events.set(undefined, data);

  const payload = { guild_id: data.guild_id, event_id: data.id };
  publisher.publish(
   CacheEvents.guildScheduledEventUpdate,
   JSON.stringify(payload as Message<CacheEvents.guildScheduledEventUpdate>),
  );
 },

 [GatewayDispatchEvents.GuildScheduledEventUserAdd]: (
  _: GatewayGuildScheduledEventUserAddDispatchData,
 ) => undefined,

 [GatewayDispatchEvents.GuildScheduledEventUserRemove]: (
  _: GatewayGuildScheduledEventUserRemoveDispatchData,
 ) => undefined,

 [GatewayDispatchEvents.GuildSoundboardSoundCreate]: async (
  data: GatewayGuildSoundboardSoundCreateDispatchData,
 ) => {
  if (!data.guild_id) return;
  await redis.soundboards.set(undefined, data);

  const payload = { guild_id: data.guild_id, sound_id: data.sound_id };
  publisher.publish(
   CacheEvents.guildSoundboardSoundCreate,
   JSON.stringify(payload as Message<CacheEvents.guildSoundboardSoundCreate>),
  );
 },

 [GatewayDispatchEvents.GuildSoundboardSoundDelete]: async (
  data: GatewayGuildSoundboardSoundDeleteDispatchData,
 ) => {
  await redis.soundboards.del(undefined, data.sound_id);

  const payload = { guild_id: data.guild_id, sound_id: data.sound_id };
  publisher.publish(
   CacheEvents.guildSoundboardSoundDelete,
   JSON.stringify(payload as Message<CacheEvents.guildSoundboardSoundDelete>),
  );
 },

 [GatewayDispatchEvents.GuildSoundboardSoundUpdate]: async (
  data: GatewayGuildSoundboardSoundUpdateDispatchData,
 ) => {
  if (!data.guild_id) await redis.soundboards.set(undefined, data);

  const payload = { guild_id: data.guild_id, sound_id: data.sound_id };
  publisher.publish(
   CacheEvents.guildSoundboardSoundUpdate,
   JSON.stringify(payload as Message<CacheEvents.guildSoundboardSoundUpdate>),
  );
 },

 [GatewayDispatchEvents.GuildSoundboardSoundsUpdate]: async (
  data: GatewayGuildSoundboardSoundsUpdateDispatchData,
 ) => {
  const sounds = await RedisClient.hgetall(redis.soundboards.keystore(data.guild_id));
  const pipeline = RedisClient.pipeline();
  pipeline.del(...Object.keys(sounds));
  pipeline.del(redis.soundboards.keystore(data.guild_id));
  await pipeline.exec();

  data.soundboard_sounds.forEach((sound) =>
   redis.soundboards.set(undefined, { ...sound, guild_id: data.guild_id }),
  );

  publisher.publish(
   CacheEvents.soundboardSounds,
   JSON.stringify({ guild_id: data.guild_id } as Message<CacheEvents.soundboardSounds>),
  );
 },

 [GatewayDispatchEvents.GuildStickersUpdate]: async (
  data: GatewayGuildStickersUpdateDispatchData,
 ) => {
  const stickers = await RedisClient.hgetall(redis.stickers.keystore(data.guild_id));
  const pipeline = RedisClient.pipeline();
  pipeline.del(...Object.keys(stickers));
  pipeline.del(redis.stickers.keystore(data.guild_id));

  await Promise.all(
   data.stickers.map((sticker) =>
    redis.stickers.set(pipeline, { ...sticker, guild_id: data.guild_id }),
   ),
  );
  await pipeline.exec();

  publisher.publish(
   CacheEvents.stickersUpdate,
   JSON.stringify({ guild_id: data.guild_id } as Message<CacheEvents.stickersUpdate>),
  );
 },
} as const;
