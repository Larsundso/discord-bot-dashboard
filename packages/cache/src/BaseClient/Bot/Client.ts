import { Client, API as DAPI } from '@discordjs/core';
import { REST } from '@discordjs/rest';
import { CompressionMethod, Encoding, WebSocketManager, WebSocketShardEvents } from '@discordjs/ws';
import { GatewayDispatchEvents, GatewayIntentBits, GatewayOpcodes } from 'discord-api-types/v10';
import { ClusterClient, getInfo } from 'discord-hybrid-sharding';
import { cache as RedisCache } from './Redis.js';
import rawCache from './Cache.js';

const token = (
 process.execArgv.find((v) => v.includes('--token')) ||
 process.argv.find((v) => v.includes('--token='))
)?.split('=')[1];

if (!token) throw new Error('No token provided. Please provide a token using --token=<your_token>');

const rest = new REST();
rest.setToken(token);

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
 token,
 compression: CompressionMethod.ZlibNative,
 encoding: Encoding.JSON,
 initialPresence: null,
 useIdentifyCompression: true,
 largeThreshold: 250,
});

gateway.connect();

export const API = new DAPI(rest);
export const clientUser = await API.users.getCurrent();

class CustomClient extends Client {
 cluster: ClusterClient<CustomClient> | null = null;
 cache: typeof RedisCache = RedisCache;
 clientUser: typeof clientUser = clientUser;

 constructor() {
  super({ rest, gateway });
 }

 addCluster(cluster: ClusterClient<CustomClient>) {
  this.cluster = cluster;
 }
}

const client = new CustomClient();
export const cluster = new ClusterClient(client);
export const cache = RedisCache;
client.addCluster(cluster);

export default client;

client.once(GatewayDispatchEvents.Ready, () =>
 console.log(`Shards ${getInfo().SHARD_LIST.join(', ')} ready`),
);

client.gateway.on(WebSocketShardEvents.Dispatch, (data) => {
 if (data.op !== GatewayOpcodes.Dispatch) return;
 rawCache(data);

 // switch (data.t) {
 // TODO: wait for d to document this
 // case 'VOICE_CHANNEL_STATUS_UPDATE' as GatewayDispatchEvents:
 //  voiceChannelStatusUpdate(data.d as unknown as Parameters<typeof voiceChannelStatusUpdate>[0]);
 //  break;
 // TODO: wait for d to document this
 // case 'CHANNEL_STATUSES' as GatewayDispatchEvents:
 //  channelStatuses(data.d as unknown as Parameters<typeof channelStatuses>[0]);
 //  break;
 // default:
 //  break;
 // }
});
