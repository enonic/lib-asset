export const enum CONTENT_TYPE {
  CSS = 'text/css',
  EXE = 'application/octet-stream',
  HTML = 'text/html',
  ICO = 'image/x-icon',
  JAVASCRIPT = 'application/javascript',
  JSON = 'application/json',
  TEXT = 'text/plain',
  XML = 'application/xml',
  WEBMANIFEST = 'application/manifest+json'
}

const enum CACHE_CONTROL_DIRECTIVE {
  IMMUTABLE = 'immutable',
  MAX_AGE = 'max-age',
  MAX_STALE = 'max-stale',
  MIN_FRESH = 'min-fresh',
  MUST_REVALIDATE = 'must-revalidate',
  MUST_UNDERSTAND = 'must-understand',
  NO_CACHE = 'no-cache',
  NO_STORE = 'no-store',
  NO_TRANSFORM = 'no-transform',
  ONLY_IF_CACHED = 'only-if-cached',
  PRIVATE = 'private',
  PROXY_REVALIDATE = 'proxy-revalidate',
  PUBLIC = 'public',
  S_MAX_AGE = 's-maxage',
  STALE_IF_ERROR = 'stale-if-error',
  STALE_WHILE_REVALIDATE = 'stale-while-revalidate',
}

export const enum REQUEST_CACHE_CONTROL_DIRECTIVE {
  MAX_AGE = CACHE_CONTROL_DIRECTIVE.MAX_AGE,
  MAX_STALE = CACHE_CONTROL_DIRECTIVE.MAX_STALE,
  MIN_FRESH = CACHE_CONTROL_DIRECTIVE.MIN_FRESH,
  NO_CACHE = CACHE_CONTROL_DIRECTIVE.NO_CACHE,
  NO_STORE = CACHE_CONTROL_DIRECTIVE.NO_STORE,
  NO_TRANSFORM = CACHE_CONTROL_DIRECTIVE.NO_TRANSFORM,
  ONLY_IF_CACHED = CACHE_CONTROL_DIRECTIVE.ONLY_IF_CACHED,
  STALE_IF_ERROR = CACHE_CONTROL_DIRECTIVE.STALE_IF_ERROR
}

export const enum RESPONSE_CACHE_CONTROL_DIRECTIVE {
  IMMUTABLE = CACHE_CONTROL_DIRECTIVE.IMMUTABLE,
  MAX_AGE = CACHE_CONTROL_DIRECTIVE.MAX_AGE,
  MUST_REVALIDATE = CACHE_CONTROL_DIRECTIVE.MUST_REVALIDATE,
  MUST_UNDERSTAND = CACHE_CONTROL_DIRECTIVE.MUST_UNDERSTAND,
  NO_CACHE = CACHE_CONTROL_DIRECTIVE.NO_CACHE,
  NO_STORE = CACHE_CONTROL_DIRECTIVE.NO_STORE,
  NO_TRANSFORM = CACHE_CONTROL_DIRECTIVE.NO_TRANSFORM,
  PRIVATE = CACHE_CONTROL_DIRECTIVE.PRIVATE,
  PROXY_REVALIDATE = CACHE_CONTROL_DIRECTIVE.PROXY_REVALIDATE,
  PUBLIC = CACHE_CONTROL_DIRECTIVE.PUBLIC,
  S_MAX_AGE = CACHE_CONTROL_DIRECTIVE.S_MAX_AGE,
  STALE_IF_ERROR = CACHE_CONTROL_DIRECTIVE.STALE_IF_ERROR,
  STALE_WHILE_REVALIDATE = CACHE_CONTROL_DIRECTIVE.STALE_WHILE_REVALIDATE
}

export const enum HTTP2_REQUEST_HEADER {
  ACCEPT_ENCODING = 'accept-encoding',
  CACHE_CONTROL = 'cache-control',
  IF_NONE_MATCH = 'if-none-match'
}

export const enum HTTP2_RESPONSE_HEADER {
  CACHE_CONTROL = 'cache-control',
  CONTENT_ENCODING = 'content-encoding',
  ETAG = 'etag',
  VARY = 'vary'
}

// https://www.iana.org/assignments/http-parameters/http-parameters.xhtml#content-coding
export const enum CONTENT_CODING {
  AES128GCM = 'aes128gcm',
  BR = 'br',
  COMPRESS = 'compress',
  DCB = 'dcb',
  DCZ = 'dcz',
  DEFLATE = 'deflate',
  EXI = 'exi',
  GZIP = 'gzip',
  IDENTITY = 'identity',
  PACK200_GZIP = 'pack200-gzip',
  ZSTD = 'zstd'
}

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding
export const enum CONTENT_ENCODING {
  BR = 'br',
  COMPRESS = 'compress',
  DEFLATE = 'deflate',
  GZIP = 'gzip',
  ZSTD = 'zstd'
}

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching#vary
export const enum VARY {
  ACCEPT = 'Accept',
  ACCEPT_ENCODING = 'Accept-Encoding',
  ACCEPT_LANGUAGE = 'Accept-Language',
}

export const enum RESPONSE_CACHE_CONTROL {
  CRAWLER = `${
    RESPONSE_CACHE_CONTROL_DIRECTIVE.PUBLIC}, ${
    RESPONSE_CACHE_CONTROL_DIRECTIVE.MAX_AGE}=600`,
  EDGE = `${
    RESPONSE_CACHE_CONTROL_DIRECTIVE.PUBLIC}, ${
    RESPONSE_CACHE_CONTROL_DIRECTIVE.MAX_AGE}=10, ${
    RESPONSE_CACHE_CONTROL_DIRECTIVE.S_MAX_AGE}=600`,
  IMMUTABLE = `${
    RESPONSE_CACHE_CONTROL_DIRECTIVE.PUBLIC}, ${
    RESPONSE_CACHE_CONTROL_DIRECTIVE.MAX_AGE}=31536000, ${
    RESPONSE_CACHE_CONTROL_DIRECTIVE.IMMUTABLE}`,
  PREVENT = `${
    RESPONSE_CACHE_CONTROL_DIRECTIVE.PUBLIC}, ${
    RESPONSE_CACHE_CONTROL_DIRECTIVE.MAX_AGE}=0, ${
    RESPONSE_CACHE_CONTROL_DIRECTIVE.MUST_REVALIDATE}`,
  SAFE = `${
    RESPONSE_CACHE_CONTROL_DIRECTIVE.PUBLIC}, ${
    RESPONSE_CACHE_CONTROL_DIRECTIVE.MAX_AGE}=10, ${
    RESPONSE_CACHE_CONTROL_DIRECTIVE.STALE_WHILE_REVALIDATE}=50`,
}

export const DEFAULT_CACHE_CONTROL = `${
  RESPONSE_CACHE_CONTROL_DIRECTIVE.PUBLIC}, ${
  RESPONSE_CACHE_CONTROL_DIRECTIVE.MAX_AGE}=31536000, ${
  RESPONSE_CACHE_CONTROL_DIRECTIVE.IMMUTABLE}`;

export const INDEXFALLBACK_CACHE_CONTROL = RESPONSE_CACHE_CONTROL_DIRECTIVE.NO_CACHE

export const GETTER_ROOT = 'assets';

export const REGEX_PATH_DOUBLE_DOT = /\.\./;
export const REGEX_PATH_ILLEGAL_CHARS = /[<>:"'`´\\|?*]/;
