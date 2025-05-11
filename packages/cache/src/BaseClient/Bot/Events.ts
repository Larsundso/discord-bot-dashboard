import { cluster } from './Client.js';
import client from './Client.js';
import { WebSocketShardEvents } from '@discordjs/ws';
import { /* GatewayDispatchEvents, */ GatewayOpcodes } from 'discord-api-types/v10';
import cache from './Cache.js';

if (cluster?.maintenance) {
 console.log(`[Cluster ${cluster.id + 1}] Cluster spawned in Maintenance-Mode`);

 cluster?.on('ready', async () => {
  console.log(`[Cluster ${Number(cluster?.id) + 1}] Cluster moved into Ready-State`);
 });
}

client.gateway.on(WebSocketShardEvents.Dispatch, (data) => {
 if (data.op !== GatewayOpcodes.Dispatch) return;
 cache(data);

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
