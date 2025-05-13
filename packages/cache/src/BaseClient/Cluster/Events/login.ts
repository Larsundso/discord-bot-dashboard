import { ClusterManager } from 'discord-hybrid-sharding';
import { redis } from '../Redis.js';
import type { APIUser } from 'discord.js';

export let loggedIn: ClusterManager | null = null;

export default async () => {
 const selfS = await redis.get('self');
 const token = await redis.get('token');
 if (!selfS) return;
 if (!token) return;

 const self = JSON.parse(selfS) as APIUser;
 if (!self) return;

 console.log(`Logged in as ${self.username}#${self.discriminator} (${self.id})`);

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
