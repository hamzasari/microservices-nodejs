import { satisfies } from 'semver';
import { P2cBalancer } from 'load-balancers';

import config from '../config';

const services: { [key: string]: Service } = {};

interface Service {
  timestamp: number;
  ip: string;
  port: number;
  name: string;
  version: string;
}

const getKey = (
  name: string,
  version: string,
  ip: string,
  port: number
): string => {
  return `${name}-${version}-${ip}-${port}`;
};

const cleanup = () => {
  const now = Math.floor(Date.now() / 1000);

  for (const key in services) {
    if (services[key].timestamp + config.registeredServiceTimeout < now) {
      delete services[key];
      console.log(`Removed expired service ${key}`);
    }
  }
};

/**
 * The function `get` returns a random service that matches the given name and
 * version, after filtering the available services and performing load balancing.
 * @param {string} name - The `name` parameter is a string that represents the name
 * of the service you are looking for.
 * @param {string} version - The `version` parameter is a string that represents
 * the desired version of the service.
 * @returns The function `get` returns a `Service` object or `null`.
 */
const get = (name: string, version: string): Service | null => {
  cleanup();

  const candidates = Object.values(services).filter((service) => {
    return service.name === name && satisfies(service.version, version);
  });

  const balancer = new P2cBalancer(candidates.length);
  return candidates[balancer.pick()];
};

/**
 * The `register` function registers a service with a given name, version, IP
 * address, and port number, and returns a unique key for the service.
 * @param {string} name - The `name` parameter is a string that represents the name
 * of the service being registered.
 * @param {string} version - The `version` parameter in the `register` function is
 * a string that represents the version of the service being registered.
 * @param {string} ip - The `ip` parameter in the `register` function represents
 * the IP address of the service being registered.
 * @param {number} port - The `port` parameter is of type `number` and represents
 * the port number on which the service is running.
 * @returns The function `register` returns a string value.
 */
const register = (
  name: string,
  version: string,
  ip: string,
  port: number
): string => {
  cleanup();

  const key = getKey(name, version, ip, port);

  if (!services[key]) {
    services[key] = {
      timestamp: Math.floor(Date.now() / 1000),
      ip,
      port,
      name,
      version
    };
    console.log(`Added service ${name}, version ${version} at ${ip}:${port}`);

    return key;
  }

  services[key].timestamp = Math.floor(Date.now() / 1000);
  console.log(`Updated service ${name}, version${version} at ${ip}:${port}`);

  return key;
};

/**
 * The `unregister` function deletes a service from a registry based on its name,
 * version, IP, and port, and returns the key of the deleted service.
 * @param {string} name - The `name` parameter represents the name of the service
 * that you want to unregister. It should be a string value.
 * @param {string} version - The `version` parameter is a string that represents
 * the version of the service being unregistered.
 * @param {string} ip - The `ip` parameter in the `unregister` function represents
 * the IP address of the service that needs to be unregistered.
 * @param {number} port - The `port` parameter is of type `number` and represents
 * the port number of the service that needs to be unregistered.
 * @returns the key that was used to unregister the service.
 */
const unregister = (
  name: string,
  version: string,
  ip: string,
  port: number
): string => {
  const key = getKey(name, version, ip, port);

  delete services[key];
  console.log(`Deleted service ${name}, version${version} at ${ip}:${port}`);

  return key;
};

export { get, register, unregister };
