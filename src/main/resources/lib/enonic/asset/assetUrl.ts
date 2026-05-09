import {isCacheBust, isHttp2PushPreload} from './config';
import {getFingerprint} from './runMode';
import {ScriptValue} from '@enonic-types/core';
import type {Response} from './types';

// Asset API URL format:
// /_/<app-name>:asset/<fingerprint>/<asset-path>

export interface AssetUrlParams {
  as?: string;
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
    addLinkHeader(params?.response, url, params?.as);
  }

  return url;
}

function addLinkHeader(response: Response | undefined, url: string, as?: string): void {
  if (!response?.headers || !url || !url.trim()) {
    return;
  }

  const link = as ? `<${url}>; rel=preload; as=${as}` : `<${url}>; rel=preload`;
  const previousLink = response.headers.link || response.headers.Link;
  if (Object.prototype.hasOwnProperty.call(response.headers, 'Link')) {
    delete response.headers.Link;
  }

  if (!previousLink) {
    response.headers.link = link;
    return;
  }

  if (Array.isArray(previousLink)) {
    const values = previousLink.map((value) => String(value));
    if (values.indexOf(link) === -1) {
      values.push(link);
    }
    response.headers.link = values.join(', ');
    return;
  }

  const previous = String(previousLink);
  if (!previous.split(',').some((item) => item.trim() === link)) {
    response.headers.link = `${previous}, ${link}`;
  }
}
