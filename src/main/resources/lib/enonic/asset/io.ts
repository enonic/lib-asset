import type { ResourceKey } from '/lib/xp/io';


const ioService = __.newBean<{
  getMimeType: (name: string|ResourceKey) => string,
}>('com.enonic.lib.asset.IoService');

export const getMimeType = (name: string|ResourceKey) => {
    return ioService.getMimeType(name);
};
