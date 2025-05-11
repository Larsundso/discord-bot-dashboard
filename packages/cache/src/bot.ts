/* eslint-disable no-console */
import 'dotenv/config';
import sms from 'source-map-support';

import './BaseClient/Bot/Client.js';
import './BaseClient/Bot/Events.js';

sms.install({
 handleUncaughtExceptions: true,
 environment: 'node',
 emptyCacheBetweenOperations: true,
});
