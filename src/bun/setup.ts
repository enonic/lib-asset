import {
  // getResource,
  ByteSource,
  type ResourceKey
} from '@enonic-types/lib-io';
import type { AssetUrlParams } from '@enonic-types/lib-portal';
import type { App, DoubleUnderscore, Log } from './global.d';

import {
  // expect,
  // jest,
  mock,
  // test as it
} from 'bun:test';
// @ts-ignore
import { stringify } from 'q-i';
// import { Resource } from '../jest/Resource';
import { FINGERPRINT } from './constants';
import { mockEtagService } from './mocks/etagService';
import { mockIoService, mockGetResource } from './mocks/ioService';



// Avoid type errors
declare module globalThis {
  var app: App
  var log: Log
  var __: DoubleUnderscore
  var _devMode: boolean;
  var _resources: Record<string, {
    bytes?: string
    exists?: boolean
    etag?: string
    isDirectory?: boolean
    mimeType?: string
  }>
}

const LOG_LEVEL: 'debug' | 'error' | 'info' | 'warn' | 'silent' = 'silent';


export const isObject = (value: object | unknown): value is object =>
	Object.prototype.toString.call(value).slice(8,-1) === 'Object';

globalThis._devMode = false;

globalThis.app = {
  name: 'com.example.myproject',
  config: {},
  version: '1.0.0'
};

const wrap = (code: number) => `\u001b[${code}m`;
const reset = wrap(0);
const bold = wrap(1);
const dim = wrap(2);
const italic = wrap(3);
const underline = wrap(4);
const inverse = wrap(7);
const hidden = wrap(8);
const strikethrough = wrap(9);
const black = wrap(30);
const red = wrap(31);
const green = wrap(32);
const yellow = wrap(33);
const blue = wrap(34);
const magenta = wrap(35);
const cyan = wrap(36);
const white = wrap(37);
const grey = wrap(90);
const brightRed = wrap(91);
const brightGreen = wrap(92);
const brightYellow = wrap(93);
const brightBlue = wrap(94);
const brightMagenta = wrap(95);
const brightCyan = wrap(96);
const brightWhite = wrap(97);


function colorize(a: unknown[], color = brightYellow) {
  return a.map(i => {
    if (typeof i === 'string') {
      return `${green}${i}${color}`;
    }
    if (typeof i === 'undefined' || i === null) {
      return `${yellow}${i}${color}`;
    }
    if (typeof i === 'boolean') {
      return `${magenta}${i}${color}`;
    }
    if (typeof i === 'number') {
      return `${blue}${i}${color}`;
    }
    return `${reset}${stringify(i, { maxItems: Infinity })}${color}`
  });
}

export function rpad(
	u: unknown,
	w: number = 2,
	z: string = ' '
): string {
	const s = '' + u; // Cast to string
	return s.length >= w
		? s
		: s + new Array(w - s.length + 1).join(z);
}

function logWith({
  color,
  // level = 'debug',
  name,
  format,
  values
}: {
  color: string,
  // level?: 'debug' | 'error' | 'info' | 'warn' | 'silent',
  name: 'debug' | 'error' | 'info' | 'warn',
  format: string,
  values: unknown[]
}) {
  if (
    LOG_LEVEL === 'silent' ||
    (LOG_LEVEL === 'info' && name === 'debug') ||
    (LOG_LEVEL === 'warn' && (name === 'debug' || name === 'info')) ||
    (LOG_LEVEL === 'error' && (name === 'debug' || name === 'info' || name === 'warn'))
  ) {
    return;
  }
  const prefix = `${color}${rpad(name.toUpperCase(), 6)}${format}${reset}`;
  if (values.length) {
    console[name](prefix, ...colorize(values, color));
  } else {
    console[name](prefix);
  }
}


globalThis.log = {
  // debug: () => {},
  // error: () => {},
  // info: () => {},
  // warning: () => {},
  // @ts-ignore
  debug: (format: string, ...s: unknown[]): void => {
    logWith({
      color: grey,
      name: 'debug',
      format,
      values: s
    });
  },
  // @ts-ignore
  error: (format: string, ...s: unknown[]): void => {
    logWith({
      color: brightRed,
      name: 'error',
      format,
      values: s
    });
  },
  // @ts-ignore
  info: (format: string, ...s: unknown[]): void => {
    logWith({
      color: white,
      name: 'info',
      format,
      values: s
    });
  },
  // @ts-ignore
  warning: (format: string, ...s: unknown[]): void => {
    logWith({
      color: brightYellow,
      name: 'warn',
      format,
      values: s
    });
  },
}

globalThis._resources = { // This should establish an object pointer that should no be overwritten.
  '/com.enonic.lib.asset.json': {
    exists: false
  },
  '/static/index.css': {
    bytes: 'body { color: green; }',
    exists: true,
    etag: 'etag-index-css', // 1234567890abcdef
    mimeType: 'text/css',
  },
  '/static/404.css': {
    exists: false
  }
};
// log.info('initial globalThis._resources:%s', globalThis._resources);

globalThis.__ = {
  // @ts-ignore
  newBean: (bean: string) => {
    if (bean === 'com.enonic.lib.asset.AppHelper') {
      return {
        isDevMode: () => globalThis._devMode,
        getFingerprint: (application: string) => {
          // log.debug('getFingerprint(%s) --> %s', application, FINGERPRINT);
          return FINGERPRINT;
        },
      };
    }
    if (bean === 'com.enonic.lib.asset.etag.EtagService') {
      return mockEtagService({ resources: globalThis._resources });
    }
    if (bean === 'com.enonic.lib.asset.IoService') {
      return mockIoService();
    }
    throw new Error(`Unmocked bean:${bean}!`);
  },
  nullOrValue: (v: any) => {
    log.debug(`nullOrValue value:${JSON.stringify(v, null, 4)}`);
    return v;
  },
  toNativeObject: (v: any) => {
    if (
      isObject(v)
    ) {
      return v as any;
    }
    throw new Error(`toNativeObject: Unmocked value:${JSON.stringify(v, null, 4)}!`);
  },
  toScriptValue: (v: any) => {
    log.debug(`toScriptValue value:${JSON.stringify(v, null, 4)}`);
    return v;
  },
};

const BASEURL_WEBAPP = `/webapp/${app.name}`;
const BASEURL = BASEURL_WEBAPP;

mock.module('/lib/xp/io', () => ({
  getResource: mockGetResource(),
  readText: (_stream: ByteSource) => {
    return _stream as unknown as string;
  }
}));

mock.module('/lib/xp/portal', () => ({
  assetUrl: (({
    params,
    type,
  }: AssetUrlParams) => {
    const query = params ? `?${new URLSearchParams(params as Record<string,string>).toString()}` : '';
    const prefix = type === 'absolute' ? 'http://localhost:8080' : '';
    return `${prefix}${BASEURL}/_/asset/${app.name}:${FINGERPRINT}${query}`;
  }),
}));
