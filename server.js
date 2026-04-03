import { createServer } from 'vite';
import { createBareServer } from '@tomphttp/bare-server-node';
import { createServer as createHttpServer } from 'http';

const vite = await createServer({
  server: {
    middlewareMode: true,
  },
  appType: 'spa',
});

const bareServer = createBareServer('/bare/');

const server = createHttpServer();

server.on('request', (req, res) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  } else {
    vite.middlewares(req, res);
  }
});

server.on('upgrade', (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  }
});

server.listen(5173, () => {
  console.log('Server running at http://localhost:5173/');
  console.log('Bare server at http://localhost:5173/bare/');
});
