import type { ResourceKey } from '@enonic-types/lib-io';
import type { Log } from '../global.d';

import { Resource } from './Resource';


// Avoid type errors
declare module globalThis {
  var log: Log
  var _resources: Record<string, {
    bytes?: string
    exists?: boolean
    etag?: string
    mimeType?: string
  }>
}


export function mockGetResource() {
  return (key: string|ResourceKey) => {
    // log.info('mockGetResource key:%s globalThis._resources:%s', key, globalThis._resources);
    const resource = globalThis._resources[key as string];
    if (!resource) {
      throw new Error(`getResource: Unmocked key:${JSON.stringify(key, null, 4)}!`);
    }

    if (!resource.exists) {
      return {
        exists: () => false,
      };
    }

    return new Resource({
      bytes: resource.bytes || '',
      exists: true,
      key: key.toString(),
      size: (resource.bytes || '').length,
      timestamp: 2
    });
  };
}

export function mockIoService() {
  return {
    getMimeType: (name: string|ResourceKey) => {
      const mimeType = globalThis._resources[name as string]?.mimeType;
      if (mimeType) {
        return mimeType;
      }
      log.warning(`getMimeType: Unmocked name:${name}!`);
      return 'application/octet-stream';
    },
  }
}