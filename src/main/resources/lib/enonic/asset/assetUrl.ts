import { isFingerprintEnabled } from './config';
import { serviceUrlRootViaAssetUrl } from './serviceUrlRootViaAssetUrl';
import { getFingerprint } from './runMode';

// https://developer.enonic.com/docs/xp/stable/runtime/engines/asset-service
// <app-root>/_/asset/<app-name><:build-id>/<asset-path>

// https://developer.enonic.com/docs/xp/stable/runtime/engines/http-service
// **/_/service/<appname>/<servicename>

export interface AssetUrlParams {
  // Required
  path: string
  // Optional
  application?: string
  fingerprinting?: boolean
  params?: object
  type?: 'server' | 'absolute'
}

export function assetUrl({
  application = app.name,
  fingerprinting = isFingerprintEnabled(),
  params,
  path,
  type,
}: AssetUrlParams): string {
  const pathWithoutTrailingSlash = path.replace(/\/$/, '');
  let staticServiceUrl = serviceUrlRootViaAssetUrl({
    application,
    params,
    service: 'asset',
    type,
  });
  if (fingerprinting) {
    const fingerprint = getFingerprint(application);
    if (fingerprint) {
      staticServiceUrl = staticServiceUrl.replace(`/_/service/${application}/asset`, `/_/service/${application}/asset/${fingerprint}`);
    }
  }

  const firstQuestionMarkIndex = staticServiceUrl.indexOf('?');
  if (firstQuestionMarkIndex !== -1) {
    return `${staticServiceUrl.substring(0, firstQuestionMarkIndex)}/${pathWithoutTrailingSlash}${staticServiceUrl.substring(firstQuestionMarkIndex)}`;
  }
  return `${staticServiceUrl}/${pathWithoutTrailingSlash}`;
}