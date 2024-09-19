import {isCacheBust} from './config';
import {serviceUrlRootViaAssetUrl} from './serviceUrlRootViaAssetUrl';
import {getFingerprint} from './runMode';

// https://developer.enonic.com/docs/xp/stable/runtime/engines/asset-service
// <app-root>/_/asset/<app-name><:build-id>/<asset-path>

// https://developer.enonic.com/docs/xp/stable/runtime/engines/http-service
// **/_/service/<appname>/<servicename>

export interface AssetUrlParams {
  // Required
  path: string
  // Optional
  params?: object
  type?: 'server' | 'absolute'
}

export function assetUrl({
  params,
  path,
  type,
}: AssetUrlParams): string {
  const pathWithoutTrailingSlash = path.replace(/\/$/, '');
  let assetServiceUrl = serviceUrlRootViaAssetUrl({
    params,
    service: 'asset',
    type,
  });
  if (isCacheBust()) {
    const fingerprint = getFingerprint(app.name);
    if (fingerprint) {
      assetServiceUrl = assetServiceUrl.replace(`/_/service/${app.name}/asset`, `/_/service/${app.name}/asset/${fingerprint}`);
    }
  }

  const firstQuestionMarkIndex = assetServiceUrl.indexOf('?');
  if (firstQuestionMarkIndex !== -1) {
    return `${assetServiceUrl.substring(0, firstQuestionMarkIndex)}/${pathWithoutTrailingSlash}${assetServiceUrl.substring(firstQuestionMarkIndex)}`;
  }
  return `${assetServiceUrl}/${pathWithoutTrailingSlash}`;
}
