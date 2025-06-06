import type { APIGuildScheduledEvent } from 'discord-api-types/v10';
import type Redis from 'ioredis';
import Cache from './base.js';
import type { ChainableCommander } from 'ioredis';

export type REvent = Omit<APIGuildScheduledEvent, 'creator' | 'image'> & {
 image_url: string | null;
 creator_id: string | null;
};

export const REventKeys = [
 'channel_id',
 'entity_metadata',
 'id',
 'guild_id',
 'creator_id',
 'name',
 'description',
 'scheduled_start_time',
 'scheduled_end_time',
 'privacy_level',
 'entity_type',
 'entity_id',
 'entity_metadata',
 'user_count',
 'image_url',
 'recurrence_rule',
 'status',
] as const;

export default class EventCache extends Cache<APIGuildScheduledEvent> {
 public keys = REventKeys;

 public static getImageUrl(hash: string, guildId: string) {
  return `https://cdn.discordapp.com/guild-events/${guildId}/${hash}.${hash.startsWith('a_') ? 'gif' : 'webp'}`;
 }

 constructor(redis: Redis) {
  super(redis, 'events');
 }

 async set(pipeline: ChainableCommander | undefined, data: APIGuildScheduledEvent) {
  const rData = this.apiToR(data);
  if (!rData) return false;

  await this.setValue(rData, [rData.guild_id], [rData.id], undefined, pipeline);
  return true;
 }

 apiToR(data: APIGuildScheduledEvent) {
  const keysNotToCache = Object.keys(data).filter(
   (key): key is keyof typeof data => !this.keys.includes(key as (typeof this.keys)[number]),
  );

  const rData = structuredClone(data) as unknown as REvent;
  rData.image_url = data.image ? EventCache.getImageUrl(data.image, data.guild_id) : null;
  rData.creator_id = data.creator?.id || null;

  keysNotToCache.forEach((k) => delete (rData as Record<string, unknown>)[k as string]);

  return rData;
 }
}
