import {ByteSource, Resource, ResourceKey} from '@enonic-types/core';

const ioService = __.newBean<{
  getMimeType: (name: string) => string,
  getResource: (key: string | ResourceKey) => JavaResource,
  readText(value: ByteSource): string;
}>('com.enonic.lib.asset.IoService');

interface JavaResource {
  getSize(): number;

  getTimestamp(): number;

  getBytes(): ByteSource;

  exists(): boolean;
}

class ResourceImpl
  implements Resource {
  private res: JavaResource;

  constructor(key: string | ResourceKey) {
    this.res = ioService.getResource(key);
  }

  getSize(): number {
    return this.res.getSize();
  }

  getTimestamp(): number {
    return this.res.getTimestamp();
  }

  getStream(): ByteSource {
    return this.res.getBytes();
  }

  exists(): boolean {
    return this.res.exists();
  }
}

export const getMimeType = (name: string): string => {
  return ioService.getMimeType(name);
};

export function getResource(key: string | ResourceKey): Resource {
  return new ResourceImpl(key);
}

export function readText(stream: ByteSource): string {
  return ioService.readText(stream);
}
