import Redis from 'ioredis';
import { WebsiteEvents } from './Events.js';

export const publisher = new Redis({ host: '127.0.0.1', db: 0 });
export const redis = publisher;
export const subscriber = new Redis({ db: 0, host: '127.0.0.1' });

subscriber.subscribe(...Object.values(WebsiteEvents), (err, count) => {
 if (err) throw err;
 console.log(`Subscribed to ${count} channels.`);
 console.log(`Available Website: ${Object.values(WebsiteEvents).length}`);
});
