import 'dotenv/config';
import { createServer } from 'http';

const PORT = 3001;

// Dynamic import the handler
const handler = (await import('./api/chat.js')).default;

const server = createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/api/chat' && req.method === 'POST') {
    try {
      // Collect body
      const chunks: Buffer[] = [];
      for await (const chunk of req) chunks.push(chunk as Buffer);
      const body = Buffer.concat(chunks).toString();

      // Create a Web Request from the Node.js request
      const webReq = new Request(`http://localhost:${PORT}${req.url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      const webRes: Response = await handler(webReq);

      // Stream the response back
      res.writeHead(webRes.status, Object.fromEntries(webRes.headers.entries()));

      if (webRes.body) {
        const reader = webRes.body.getReader();
        const pump = async () => {
          while (true) {
            const { done, value } = await reader.read();
            if (done) { res.end(); return; }
            res.write(value);
          }
        };
        await pump();
      } else {
        res.end(await webRes.text());
      }
    } catch (err: any) {
      console.error('Dev server error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`🚀 API dev server running at http://localhost:${PORT}`);
  console.log(`   POST /api/chat — streaming chat endpoint`);
  console.log(`   Mode: ${process.env.USE_MOCK !== 'false' ? 'MOCK' : 'LIVE'}`);
});
