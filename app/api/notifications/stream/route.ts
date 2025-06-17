
import { NextRequest } from 'next/server';
import { Client } from 'pg';
export const runtime = 'nodejs'; // 👈 force Node.js environment

import dns from 'dns';
process.env.PG_NATIVE = 'false'; // Disable pg-native
export async function GET(request: NextRequest) {
  const headers = { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' };
  const stream = new ReadableStream({
    async start(ctrl) {
      const client = new Client({ connectionString: process.env.DATABASE_URL.replace('-pooler','') });
      await client.connect();
      await client.query(`LISTEN notifications`);

      client.on('notification', msg => {
        ctrl.enqueue(`event: update\ndata: ${msg.payload}\n\n`);
      });

      request.signal.addEventListener('abort', async () => {
        await client.query('UNLISTEN notifications');
        await client.end();
      });
    }
  });

  return new Response(stream, { headers });
}
