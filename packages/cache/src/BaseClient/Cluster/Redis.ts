import Redis from 'ioredis';
import { WebsiteEvents } from './Events.js';

export const publisher = new Redis({ host: 'redis', db: 0 });
export const redis = publisher;
export const subscriber = new Redis({ db: 0, host: 'redis' });

subscriber.subscribe(...Object.values(WebsiteEvents), (err, count) => {
 if (err) throw err;
 console.log(`Subscribed to ${count} channels.`);
 console.log(`Available Website: ${Object.values(WebsiteEvents).length}`);
});
