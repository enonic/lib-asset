import type {Log} from '../global.d';

import {Resource} from './Resource';
import {ByteSource, ResourceKey} from '@enonic-types/core';
import {ByteSource} from '@enonic-types/lib-io';


// Avoid type errors
declare namespace globalThis {
  const log: Log
  const _resources: Record<string, {
    bytes?: string
    exists?: boolean
    etag?: string
    mimeType?: string
  }>
}


export function mockGetResource(): (key: string) => Resource {
  return (key: string) => {
    // log.info('mockGetResource key:%s globalThis._resources:%s', key, globalThis._resources);
    const resource = globalThis._resources[key];
    if (!resource) {
      throw new Error(`getResource: Unmocked key:${JSON.stringify(key, null, 4)}!`);
    }

    if (!resource.exists) {
      return new Resource({
        bytes: '',
        exists: false,
        key: key.toString(),
        size: 0,
        timestamp: 0,
      });
    }

    return new Resource({
      bytes: resource.bytes || '',
      exists: true,
      key: key.toString(),
      size: (resource.bytes || '').length,
      timestamp: 2,
    });
  };
}

export function mockIoService(): {
  getMimeType: (name: string) => string
  getResource: (key: string | ResourceKey) => Resource;
  readText(value: ByteSource): string;
} {
  return {
    getMimeType: (name: string) => {
      const mimeType = globalThis._resources[name]?.mimeType;
      if (mimeType) {
        return mimeType;
      }
      log.warning(`getMimeType: Unmocked name:${name}!`);
      return 'application/octet-stream';
    },
    readText(_stream: ByteSource): string {
      return _stream as unknown as string;
    },
    getResource: mockGetResource(),
  }
}
