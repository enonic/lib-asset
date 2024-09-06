import type {
  ByteSource,
  ResourceKey
} from '/lib/xp/io';
import type { LibAssetResourceInterface } from './types';


export class LibAssetResource implements LibAssetResourceInterface {
  private readonly native: LibAssetResourceInterface;

  constructor(native: LibAssetResourceInterface) {
    this.native = native;
  }

  public exists(): boolean {
    return this.native.exists();
  }

  public getBytes(): ByteSource {
    return this.native.getBytes();
  }

  public getSize(): number {
    return this.native.getSize();
  }

  public getStream(): ByteSource {
    return this.native.getBytes();
  }

  public getTimestamp(): number {
    return this.native.getTimestamp();
  }

  public isDirectory(): boolean {
    // return false;
    return this.native.isDirectory();
  }

  public readString(): string {
    return this.native.readString();
  }
} // class LibAssetResource


const ioService = __.newBean<{
  getMimeType: (name: string|ResourceKey) => string,
  getResource: (key: string|ResourceKey) => LibAssetResource
  readText: (stream: ByteSource) => string
}>('com.enonic.lib.asset.IoService');

export const getMimeType = (name: string|ResourceKey) => {
    return ioService.getMimeType(name);
};

export const getResource = (key: string|ResourceKey) => {
    const native = ioService.getResource(key);
    return new LibAssetResource(native);
};

export const readText = (stream: ByteSource) => {
    return ioService.readText(stream);
};
