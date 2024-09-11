import { isCacheBust } from './config';
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
  // application?: string
  params?: object
  type?: 'server' | 'absolute'
}

export function assetUrl({
  // application = app.name,
  params,
  path,
  type,
}: AssetUrlParams): string {
  const application = app.name;
  const pathWithoutTrailingSlash = path.replace(/\/$/, '');
  let assetServiceUrl = serviceUrlRootViaAssetUrl({
    // application,
    params,
    service: 'asset',
    type,
  });
  if (isCacheBust()) {
    const fingerprint = getFingerprint(application);
    if (fingerprint) {
      assetServiceUrl = assetServiceUrl.replace(`/_/service/${application}/asset`, `/_/service/${application}/asset/${fingerprint}`);
    }
  }

  const firstQuestionMarkIndex = assetServiceUrl.indexOf('?');
  if (firstQuestionMarkIndex !== -1) {
    return `${assetServiceUrl.substring(0, firstQuestionMarkIndex)}/${pathWithoutTrailingSlash}${assetServiceUrl.substring(firstQuestionMarkIndex)}`;
  }
  return `${assetServiceUrl}/${pathWithoutTrailingSlash}`;
}
