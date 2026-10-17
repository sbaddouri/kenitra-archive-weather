const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = 3000;

console.log('Starting Next.js server...');

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  console.log('Next.js app prepared, creating HTTP server...');
  
  const server = createServer(async (req, res) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
      console.log(`[${new Date().toISOString()}] Response: ${res.statusCode}`);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  });

  server.on('error', (err) => {
    console.error('Server error:', err);
  });

  server.on('listening', () => {
    const addr = server.address();
    console.log(`> Server listening on ${addr.address}:${addr.port}`);
  });

  server.listen(port, hostname, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });

  // Keep process alive
  process.on('SIGINT', () => {
    console.log('Shutting down...');
    server.close(() => process.exit(0));
  });
}).catch((err) => {
  console.error('Failed to prepare app:', err);
  process.exit(1);
});