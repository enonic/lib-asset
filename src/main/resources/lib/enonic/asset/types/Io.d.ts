import type {
  ByteSource,
  Resource as ResourceInterface
} from '@enonic-types/lib-io';


export interface LibAssetResourceInterface extends ResourceInterface {
  getBytes: () => ByteSource
  isDirectory: () => boolean
  readString: () => string
}
