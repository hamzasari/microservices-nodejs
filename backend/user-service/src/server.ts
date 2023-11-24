import dotenv from 'dotenv';
import http from 'http';

import app from './app';
import config from './config';

dotenv.config();

const server = http.createServer(app);

server.on('listening', () => {
  const address = server.address();
  const bind =
    typeof address === 'string' ? `pipe ${address}` : `port ${address?.port}`;

  console.info(
    `${config.serviceName}:${config.serviceVersion} listening on ${bind}`
  );
});

server.listen(0);
