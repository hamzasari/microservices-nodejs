import dotenv from 'dotenv';
import { createServer } from 'http';
import { AddressInfo } from 'net';

import app from './app';
import config from './config';
import trace from './utils/tracing';

dotenv.config();

trace(`${config.serviceName}:${config.serviceVersion}`);

const server = createServer(app);

server.on('listening', () => {
  const address = server.address() as AddressInfo;
  const bind =
    typeof address === 'string' ? `pipe ${address}` : `port ${address?.port}`;

  console.info(
    `${config.serviceName}:${config.serviceVersion} listening on ${bind}`
  );
});

server.listen(config.servicePort);
