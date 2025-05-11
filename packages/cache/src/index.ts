import type { APIUser } from '@discordjs/core';
import { ClusterManager } from 'discord-hybrid-sharding';
import * as Jobs from 'node-schedule';
import sms from 'source-map-support';
import { WebsiteEvents } from './BaseClient/Cluster/Events.js';
import { redis, subscriber } from './BaseClient/Cluster/Redis.js';

sms.install({
 handleUncaughtExceptions: true,
 environment: 'node',
 emptyCacheBetweenOperations: true,
});

Jobs.scheduleJob('*/10 * * * *', async () => {
 console.log(`=> Current Date: ${new Date().toLocaleString()}`);
});

subscriber.on('message', (channel, message) => {
 switch (channel) {
  case WebsiteEvents.LOGIN:
   login();
   break;
  default:
   console.log(`Received unknown message from ${channel}: ${message}`);
   break;
 }
});

let loggedIn: ClusterManager | null = null;

const login = async () => {
 const selfS = await redis.get('self');
 const token = await redis.get('token');
 if (!selfS) return;
 if (!token) return;

 const self = JSON.parse(selfS) as APIUser;
 if (!self) return;

 console.log(`Logged in as ${self.username}#${self.discriminator} (${self.id})`);
 console.log(loggedIn);

 if (loggedIn) {
  loggedIn.broadcastEval('this.destroy()');
  loggedIn.broadcastEval('process.exit(0)');
  loggedIn = null;
 }

 loggedIn = new ClusterManager(`./dist/bot.js`, {
  totalShards: 'auto',
  totalClusters: 'auto',
  shardsPerClusters: 10,
  token,
  shardArgs: process.argv,
  execArgv: [
   '--experimental-json-modules',
   '--experimental-wasm-modules',
   '--no-deprecation',
   '--no-warnings',
  ],
  respawn: true,
  mode: 'process',
 });

 loggedIn.on('clusterCreate', (cluster) => {
  console.log(`Cluster ${cluster.id} launched`);
 });

 loggedIn.on('clusterDelete', (cluster) => {
  console.log(`Cluster ${cluster.id} destroyed`);
 });

 loggedIn.on('clusterReady', (cluster) => {
  console.log(`Cluster ${cluster.id} is ready`);
 });

 loggedIn.on('clusterReady', (cluster) => {
  console.log(`Cluster ${cluster.id} is ready`);
 });

 loggedIn.on('debug', (debugMessage) => {
  console.log(`Debug: ${debugMessage}`);
 });

 loggedIn.spawn().catch((e: Response) => {
  console.log(
   `Startup Failed. Retry after: ${Number(e.headers?.get('retry-after') ?? 0) / 60} Minutes`,
  );
  process.exit(1);
 });
};
