import { Client, API as DAPI } from '@discordjs/core';
import { REST } from '@discordjs/rest';
import { CompressionMethod, Encoding, WebSocketManager } from '@discordjs/ws';
import { GatewayDispatchEvents, GatewayIntentBits } from 'discord-api-types/v10';
import { ClusterClient, getInfo } from 'discord-hybrid-sharding';
import redis, { cache as RedisCache } from './Redis.js';

const token = await redis.get('token');

const rest = new REST({ api: 'http://127.0.0.1:8080/api' });
rest.setToken(token!);

const gateway = new WebSocketManager({
 rest,
 intents:
  GatewayIntentBits.Guilds |
  GatewayIntentBits.GuildMembers |
  GatewayIntentBits.GuildModeration |
  GatewayIntentBits.GuildExpressions |
  GatewayIntentBits.GuildIntegrations |
  GatewayIntentBits.GuildWebhooks |
  GatewayIntentBits.GuildInvites |
  GatewayIntentBits.GuildVoiceStates |
  GatewayIntentBits.GuildMessages |
  GatewayIntentBits.GuildMessageReactions |
  GatewayIntentBits.DirectMessages |
  GatewayIntentBits.DirectMessageReactions |
  GatewayIntentBits.MessageContent |
  GatewayIntentBits.GuildScheduledEvents |
  GatewayIntentBits.AutoModerationConfiguration |
  GatewayIntentBits.AutoModerationExecution |
  GatewayIntentBits.GuildMessageTyping,
 shardCount: getInfo().TOTAL_SHARDS,
 shardIds: getInfo().SHARD_LIST,
 token: token!,
 compression: CompressionMethod.ZlibNative,
 encoding: Encoding.JSON,
 initialPresence: null,
 useIdentifyCompression: true,
 largeThreshold: 250,
});

gateway.connect();

const client = new Client({ rest, gateway });

export const cluster = new ClusterClient(client);
export const cache = RedisCache;
export const API = new DAPI(rest);
export const clientUser = await API.users.getCurrent();

export default client;

client.once(GatewayDispatchEvents.Ready, () =>
 console.log(`Shards ${getInfo().SHARD_LIST.join(', ')} ready`),
);

import('./Events.js');
