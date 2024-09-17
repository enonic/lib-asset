import { getResource, readText } from '/lib/xp/io';
import { isDev } from './runMode';


export interface Config {
  cacheBust: boolean
  cacheControl: string
  root: string
  staticCompress: boolean
}


const RESOURCE_PATH = '/com.enonic.lib.asset.json';

const DEFAULT_CONFIG: Config = {
  cacheBust: true,
  cacheControl: 'public, max-age=31536000, immutable',
  root: '/assets',
  staticCompress: true,
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

export function configuredCacheControl(): Config['cacheControl'] {
  return getConfig().cacheControl;
}

export function configuredRoot(): Config['root'] {
  return getConfig().root;
}

export function isCacheBust(): Config['cacheBust'] {
  return getConfig().cacheBust;
}

export function doStaticCompression(): Config['staticCompress'] {
  return getConfig().staticCompress;
}
