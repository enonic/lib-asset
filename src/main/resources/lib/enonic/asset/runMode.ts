const helper = __.newBean<{
  isDevMode: () => boolean
  getFingerprint: (application: string) => string
}>('lib.enonic.asset.AppHelper');
export const isDev = () => helper.isDevMode();

export const getFingerprint = (application: string) => helper.getFingerprint(application);
