import axios from 'axios';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { AddressInfo } from 'net';

import app from './app';
import config from './config';
import connectToMongoose from './utils/mongooseConnection';
import trace from './utils/tracing';

dotenv.config();

const register = async (port: number) =>
  axios
    .put(
      `${process.env.REGISTER_SERVICE_API_URL}/${config.serviceName}/${config.serviceVersion}/${port}`
    )
    .catch((error) => console.error(error));

const unregister = async (port: number) =>
  axios
    .delete(
      `${process.env.REGISTER_SERVICE_API_URL}/${config.serviceName}/${config.serviceVersion}/${port}`
    )
    .catch((error) => console.error(error));

const cleanup = async (interval: NodeJS.Timeout, port: number) => {
  clearInterval(interval);
  await unregister(port);
};

trace(`${config.serviceName}:${config.serviceVersion}`);

const server = createServer(app);

server.on('listening', () => {
  const address = server.address() as AddressInfo;
  const bind =
    typeof address === 'string' ? `pipe ${address}` : `port ${address?.port}`;

  register(address?.port);
  const interval = setInterval(() => register(address?.port), 10000);

  process.on('uncaughtException', async (error) => {
    console.error(error);
    await cleanup(interval, address?.port);
    process.exit(1);
  });

  process.on('SIGTERM', async () => {
    await cleanup(interval, address?.port);
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    await cleanup(interval, address?.port);
    process.exit(0);
  });

  console.info(
    `${config.serviceName}:${config.serviceVersion} listening on ${bind}`
  );
});

connectToMongoose(config.mongodb.url).then(() => {
  server.listen(0);
});
