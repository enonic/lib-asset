import { getResource, readText } from '/lib/xp/io';
import { isDev } from './runMode';


export interface Config {
  enabled: boolean
  fingerprint: boolean
}


const RESOURCE_PATH = '/lib/enonic/asset/config.json';

const DEFAULT_CONFIG: Config = {
  enabled: true,
  fingerprint: true,
};

function _getConfig(): Config {
  const resource = getResource(RESOURCE_PATH);
  if (!resource.exists()) {
    return DEFAULT_CONFIG;
  }
  const resourceJson: string = readText(resource.getStream());
  let configFromFile: Partial<Config> = {};
  try {
    configFromFile = JSON.parse(resourceJson);
  } catch (e) {
    log.error(`Something went wrong while parsing resource path:${RESOURCE_PATH} json:${resourceJson}!`, e);
  }
  return {
    ...DEFAULT_CONFIG,
    ...configFromFile,
  };
}

const CONFIG: Config = _getConfig();

export function getConfig(): Config {
  if (isDev()) {
    return _getConfig();
  }
  return CONFIG;
}

export function isEnabled(): Config['enabled'] {
  return getConfig().enabled;
}

export function isFingerprintEnabled(): Config['fingerprint'] {
  return getConfig().fingerprint;
}
