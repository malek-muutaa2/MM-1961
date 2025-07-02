import { drizzle as drizzleNode } from 'drizzle-orm/node-postgres'
import { Client, Pool } from 'pg'

import * as schema from './schema'




const logSql = false

export const db = drizzleNode(
  new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl:
      process.env.DB_HOST === 'localhost'
        ? false
        : {
            rejectUnauthorized: false,
          },
  }),
  {
    schema,
    logger: process.env.DB_HOST === 'localhost' && logSql ? new QueryLogger() : false,
  }
)

// const pgClient = new Client({
//   connectionString: process.env.DATABASE_URL.replace('-pooler',''),
// });
// await pgClient.connect();
// await pgClient.query(`LISTEN notifications`);

// pgClient.on('notification', async msg => {
//   const payload = JSON.parse(msg.payload!);
//   console.log('New notification received:', payload);
//   // Process as needed—or forward via SSE/WebSocket
// });