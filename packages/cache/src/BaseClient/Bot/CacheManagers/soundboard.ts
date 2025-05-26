import type { APISoundboardSound } from 'discord-api-types/v10';
import type Redis from 'ioredis';
import Cache from './base.js';
import type { ChainableCommander } from 'ioredis';

export type RSoundboardSound = Omit<APISoundboardSound, 'user' | 'guild_id'> & {
 user_id: string | null;
 guild_id: string;
 sound_url: string;
};

export const RSoundboardSoundKeys = [
 'name',
 'sound_id',
 'volume',
 'emoji_id',
 'emoji_name',
 'guild_id',
 'available',
 'user_id',
 'sound_url',
] as const;

export default class SoundboardCache extends Cache<APISoundboardSound> {
 public keys = RSoundboardSoundKeys;

 public static getSoundUrl = (id: string) => {
  return `https://cdn.discordapp.com/soundboard-sounds/${id}`;
 };

 constructor(redis: Redis) {
  super(redis, 'soundboards');
 }

 async set(pipeline: ChainableCommander | undefined, data: APISoundboardSound) {
  const rData = this.apiToR(data);
  if (!rData) return false;

  await this.setValue(rData, [rData.guild_id], [rData.sound_id], undefined, pipeline);
  return true;
 }

 apiToR(data: APISoundboardSound) {
  const keysNotToCache = Object.keys(data).filter(
   (key): key is keyof typeof data => !this.keys.includes(key as (typeof this.keys)[number]),
  );

  const rData = structuredClone(data) as unknown as RSoundboardSound;
  rData.user_id = data.user?.id || null;
  rData.sound_url = SoundboardCache.getSoundUrl(data.sound_id);

  keysNotToCache.forEach((k) => delete (rData as Record<string, unknown>)[k as string]);

  return rData;
 }
}
