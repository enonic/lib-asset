const ioService = __.newBean<{
  getMimeType: (name: string) => string,
}>('com.enonic.lib.asset.IoService');

export const getMimeType = (name: string): string => {
    return ioService.getMimeType(name);
};
