import express, { Request } from 'express';
import { get, register, unregister } from '../services/RegistryService';

const router = express.Router();

const getRequestArguments = (req: Request) => {
  const { serviceName, serviceVersion, servicePort } = req.params;
  let serviceIp = req.ip ?? '127.0.0.1';

  if (serviceIp?.includes('::1') || serviceIp?.includes('::ffff:127.0.0.1')) {
    serviceIp = '127.0.0.1';
  }

  return {
    serviceName,
    serviceVersion,
    serviceIp,
    servicePort: Number(servicePort)
  };
};

router.put(
  '/register/:serviceName/:serviceVersion/:servicePort',
  (req, res) => {
    const { serviceName, serviceVersion, servicePort, serviceIp } =
      getRequestArguments(req);

    const key = register(serviceName, serviceVersion, serviceIp, servicePort);

    return res.json({ result: key });
  }
);

router.delete(
  '/register/:serviceName/:serviceVersion/:servicePort',
  (req, res) => {
    const { serviceName, serviceVersion, servicePort, serviceIp } =
      getRequestArguments(req);

    const key = unregister(serviceName, serviceVersion, serviceIp, servicePort);

    return res.json({ result: key });
  }
);

router.get('/get/:serviceName/:serviceVersion', (req, res) => {
  const { serviceName, serviceVersion } = getRequestArguments(req);

  const result = get(serviceName, serviceVersion);
  if (!result) {
    return res.status(404).send('Not Found');
  }

  return res.json(result);
});

// All non-specified routes return 404
router.get('*', (_, res) => res.status(404).send('Not Found'));

export default router;
