import dotenv from 'dotenv';
import pkg from '../package.json';

dotenv.config();

export default {
  serviceName: pkg.name,
  serviceVersion: pkg.version,
  servicePort: process.env.PORT || 3080,
  registeredServiceTimeout: Number(process.env.REGISTERED_SERVICE_TIMEOUT) || 15
};
