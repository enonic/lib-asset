const helper = __.newBean<{
  isDevMode: () => boolean
  getFingerprint: (application: string) => string
}>('com.enonic.lib.asset.AppHelper');
export const isDev = (): boolean => helper.isDevMode();

export const getFingerprint = (application: string): string => helper.getFingerprint(application);
