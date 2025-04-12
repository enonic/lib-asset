import {isCacheBust} from './config';
import {getFingerprint} from './runMode';
import {ScriptValue} from '@enonic-types/core';

// https://developer.enonic.com/docs/xp/stable/runtime/engines/asset-service
// <app-root>/_/asset/<app-name><:build-id>/<asset-path>

// https://developer.enonic.com/docs/xp/stable/runtime/engines/http-service
// **/_/service/<appname>/<servicename>

export interface AssetUrlParams {
  params?: object;
  path?: string;
  type?: 'server' | 'absolute';
}

interface AssetUrlBuilder {
  setApplication(value: string): void;

  setPath(value: string): void;

  setType(value: string): void;

  setParams(value: ScriptValue): void;

  setFingerprint(value: string): void;

  createUrl(): string;
}

export function assetUrl(params: AssetUrlParams): string {
  const bean: AssetUrlBuilder = __.newBean<AssetUrlBuilder>('com.enonic.lib.asset.AssetUrlBuilder');

  bean.setApplication(app.name);
  bean.setPath(params?.path || '');
  bean.setType(params?.type || 'server');
  bean.setParams(__.toScriptValue(params?.params || {}));
  if (isCacheBust()) {
    const fingerprint = getFingerprint(app.name);
    if (fingerprint) {
      bean.setFingerprint(fingerprint);
    }
  }

  return bean.createUrl();
}
