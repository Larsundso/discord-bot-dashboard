import type { APIGuildMember, APIRole } from 'discord-api-types/v10';
import type Redis from 'ioredis';
import Cache from './base.js';
import RoleCache from './role.js';
import type { ChainableCommander } from 'ioredis';

export type RMember = Omit<APIGuildMember, 'user' | 'avatar' | 'banner'> & {
 user_id: string;
 guild_id: string;
 avatar_url: string | null;
 banner_url: string | null;
};

export const RMemberKeys = [
 'user_id',
 'nick',
 'avatar_url',
 'banner_url',
 'roles',
 'joined_at',
 'premium_since',
 'deaf',
 'mute',
 'flags',
 'pending',
 'communication_disabled_until',
 'avatar_decoration_data',
 'guild_id',
] as const;

export default class MemberCache extends Cache<APIGuildMember> {
 public keys = RMemberKeys;
 public rolesCache: Cache<APIRole>;

 constructor(redis: Redis) {
  super(redis, 'members');
  this.rolesCache = new RoleCache(redis);
 }

 public static bannerUrl(banner: string, userId: string, guildId: string) {
  return `https://cdn.discordapp.com/guilds/${guildId}/users/${userId}/banners/${banner}.${banner.startsWith('a_') ? 'gif' : 'webp'}`;
 }

 public static avatarUrl(avatar: string, userId: string, guildId: string) {
  return `https://cdn.discordapp.com/guilds/${guildId}/users/${userId}/avatars/${avatar}.${avatar.startsWith('a_') ? 'gif' : 'webp'}`;
 }

 public async addToList(
  pipeline: ChainableCommander | undefined,
  guildId: string,
  member: APIGuildMember,
 ) {
  const roles = await Promise.all(member.roles.map((r) => this.rolesCache.get(pipeline, r))).then(
   (r) => r.filter((role) => !!role),
  );

  const highestHoisted =
   roles
    .sort((a, b) => a.position - b.position)
    .filter((r) => r.hoist)
    .at(-1)?.position || 0;

  this.redis.zadd(
   `lists:members:${guildId}`,
   Math.abs(Number(highestHoisted) - 250),
   member.user.id,
  );
 }

 async set(pipeline: ChainableCommander | undefined, data: APIGuildMember, guildId: string) {
  const rData = this.apiToR(data, guildId);
  if (!rData) return false;

  await this.addToList(pipeline, guildId, data);
  await this.setValue(
   rData,
   [rData.guild_id],
   [rData.guild_id, rData.user_id],
   undefined,
   pipeline,
  );
  return true;
 }

 apiToR(data: APIGuildMember, guildId: string) {
  const keysNotToCache = Object.keys(data).filter(
   (key): key is keyof typeof data => !this.keys.includes(key as (typeof this.keys)[number]),
  );

  const rData = structuredClone(data) as unknown as RMember;
  rData.guild_id = guildId;
  rData.user_id = data.user.id;
  rData.avatar_url = data.avatar ? MemberCache.avatarUrl(data.avatar, data.user.id, guildId) : null;
  rData.banner_url = data.banner ? MemberCache.bannerUrl(data.banner, data.user.id, guildId) : null;

  keysNotToCache.forEach((k) => delete (rData as Record<string, unknown>)[k as string]);

  return rData;
 }
}
