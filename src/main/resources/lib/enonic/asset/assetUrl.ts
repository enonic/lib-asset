import {isCacheBust, isHttp2PushPreload} from './config';
import {getFingerprint} from './runMode';
import {ScriptValue} from '@enonic-types/core';
import type {Response} from './types';

// Asset API URL format:
// /_/<app-name>:asset/<fingerprint>/<asset-path>

export interface AssetUrlParams {
  params?: object;
  path?: string;
  response?: Response;
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

  const url = bean.createUrl();

  if (isHttp2PushPreload()) {
    addLinkHeader(params?.response, url);
  }

  return url;
}

function addLinkHeader(response: Response | undefined, url: string): void {
  if (!response?.headers || !url) {
    return;
  }

  const link = `<${url}>; rel=preload`;
  const previousLink = response.headers.Link;

  if (!previousLink) {
    response.headers.Link = link;
    return;
  }

  if (Array.isArray(previousLink)) {
    if (previousLink.indexOf(link) === -1) {
      previousLink.push(link);
    }
    response.headers.Link = previousLink;
    return;
  }

  const previous = String(previousLink);
  if (previous.split(',').map((item) => item.trim()).indexOf(link) === -1) {
    response.headers.Link = `${previous}, ${link}`;
  }
}
