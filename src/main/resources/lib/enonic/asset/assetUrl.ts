import {isCacheBust} from './config';
import {serviceUrlRootViaAssetUrl} from './serviceUrlRootViaAssetUrl';
import {getFingerprint} from './runMode';

// https://developer.enonic.com/docs/xp/stable/runtime/engines/asset-service
// <app-root>/_/asset/<app-name><:build-id>/<asset-path>

// https://developer.enonic.com/docs/xp/stable/runtime/engines/http-service
// **/_/service/<appname>/<servicename>

export interface AssetUrlParams {
  params?: object
  path?: string
  type?: 'server' | 'absolute'
}

export function assetUrl({
  params,
  path = '',
  type,
}: AssetUrlParams = {}): string {
  let assetServiceRoot = serviceUrlRootViaAssetUrl({
    params,
    service: 'asset',
    type,
  });
  if (isCacheBust()) {
    const fingerprint = getFingerprint(app.name);
    if (fingerprint) {
      assetServiceRoot = assetServiceRoot.replace(`/_/service/${app.name}/asset`, `/_/service/${app.name}/asset/${fingerprint}`);
    }
  }

  const outPath = path ? `/${
    path.replace(/\/$/, '') // Remove trailing slash
  }` : '';

  const firstQuestionMarkIndex = assetServiceRoot.indexOf('?');
  if (firstQuestionMarkIndex !== -1) {
    return `${assetServiceRoot.substring(0, firstQuestionMarkIndex)}${outPath}${assetServiceRoot.substring(firstQuestionMarkIndex)}`;
  }
  return `${assetServiceRoot}${outPath}`;
}
