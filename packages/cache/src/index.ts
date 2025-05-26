import * as Jobs from 'node-schedule';
import sms from 'source-map-support';
import { WebsiteEvents } from './BaseClient/Cluster/Events.js';
import fetchMembers from './BaseClient/Cluster/Events/fetchMembers.js';
import login from './BaseClient/Cluster/Events/login.js';
import { subscriber } from './BaseClient/Cluster/Redis.js';

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
   login(message);
   break;
  case WebsiteEvents.FETCH_GUILD_MEMBERS:
   fetchMembers(message);
   break;
  default:
   console.log(`Received unknown message from ${channel}: ${message}`);
   break;
 }
});
