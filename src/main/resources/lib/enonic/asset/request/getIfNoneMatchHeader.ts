import type { Request } from '../types';


import { HTTP2_REQUEST_HEADER } from '../constants';
import { getLowerCasedHeaders } from '../request/getLowerCasedHeaders';


export function getIfNoneMatchHeader({
  request
}: {
  request: Request
}) {
  const lowerCasedRequestHeaders = getLowerCasedHeaders({ request });
  log.debug('getIfNoneMatchHeader lowerCasedRequestHeaders: %s', JSON.stringify(lowerCasedRequestHeaders, null, 4));

  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match
  // TODO support list? If-None-Match: "<etag_value>", "<etag_value>", …
  return lowerCasedRequestHeaders[HTTP2_REQUEST_HEADER.IF_NONE_MATCH];
}
