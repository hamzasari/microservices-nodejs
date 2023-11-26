import dotenv from 'dotenv';
import pkg from '../package.json';

dotenv.config();

export default {
  serviceName: pkg.name,
  serviceVersion: pkg.version,
  mongodb: {
    url: `${process.env.MONGO_DB_URL}/${process.env.MONGO_DB_NAME}`
  },
  heartbeatInterval: Number(process.env.HEARTBEAT_INTERVAL) || 10
};
