import type { APIEmoji } from 'discord-api-types/v10';
import type Redis from 'ioredis';
import Cache from './base.js';
import type { ChainableCommander } from 'ioredis';

export type REmoji = Omit<APIEmoji, 'user' | 'id'> & {
 user_id: string | null;
 guild_id: string;
 id: string;
};

export const REmojiKeys = [
 'id',
 'name',
 'animated',
 'roles',
 'user_id',
 'require_colons',
 'managed',
 'guild_id',
] as const;

export default class EmojiCache extends Cache<APIEmoji> {
 public keys = REmojiKeys;

 constructor(redis: Redis) {
  super(redis, 'emojis');
 }

 async set(pipeline: ChainableCommander | undefined, data: APIEmoji, guildId: string) {
  const rData = this.apiToR(data, guildId);
  if (!rData) return false;

  await this.setValue(rData, [rData.guild_id], [rData.id], undefined, pipeline);
  return true;
 }

 apiToR(data: APIEmoji, guildId: string) {
  const keysNotToCache = Object.keys(data).filter(
   (key): key is keyof typeof data => !this.keys.includes(key as (typeof this.keys)[number]),
  );

  const rData = structuredClone(data) as unknown as REmoji;
  rData.guild_id = guildId;
  rData.user_id = data.user?.id || null;

  keysNotToCache.forEach((k) => delete (rData as Record<string, unknown>)[k as string]);

  return rData as REmoji;
 }
}
