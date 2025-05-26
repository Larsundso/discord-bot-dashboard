import type { APISticker } from 'discord-api-types/v10';
import type Redis from 'ioredis';
import Cache from './base.js';
import type { ChainableCommander } from 'ioredis';

export type MakeRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type RSticker = Omit<
 MakeRequired<APISticker, 'guild_id'> & { user_id: string | null },
 'user'
>;

export const RStickerKeys = [
 'id',
 'pack_id',
 'name',
 'description',
 'tags',
 'type',
 'format_type',
 'available',
 'guild_id',
 'sort_value',
 'user_id',
] as const;

export default class StickerCache extends Cache<APISticker> {
 public keys = RStickerKeys;

 constructor(redis: Redis) {
  super(redis, 'stickers');
 }

 async set(pipeline: ChainableCommander | undefined, data: APISticker) {
  const rData = this.apiToR(data);
  if (!rData) return false;

  await this.setValue(rData, [rData.guild_id], [rData.id], undefined, pipeline);
  return true;
 }

 apiToR(data: APISticker) {
  const keysNotToCache = Object.keys(data).filter(
   (key): key is keyof typeof data => !this.keys.includes(key as (typeof this.keys)[number]),
  );

  const rData = structuredClone(data) as unknown as RSticker;
  rData.user_id = data.user?.id || null;

  keysNotToCache.forEach((k) => delete (rData as unknown as Record<string, unknown>)[k as string]);

  return rData;
 }
}
