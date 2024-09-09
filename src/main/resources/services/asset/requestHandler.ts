import type { Request } from '../../lib/enonic/asset/types/Request';
import type { Response } from '../../lib/enonic/asset/types/Response';

import { getResource } from '/lib/xp/io';
import {
  HTTP2_RESPONSE_HEADER,
  RESPONSE_CACHE_CONTROL_DIRECTIVE,
  RESPONSE_NOT_MODIFIED,
} from '../../lib/enonic/asset/constants';
import {
  configuredCacheControl,
  configuredRoot,
  isCacheBust,
} from '../../lib/enonic/asset/config';
import { read } from '../../lib/enonic/asset/etagReader';
import { getMimeType } from '../../lib/enonic/asset/io';
import { getIfNoneMatchHeader } from '../../lib/enonic/asset/request/getIfNoneMatchHeader';
import { checkPath } from '../../lib/enonic/asset/resource/path/checkPath';
import { getAbsoluteResourcePathWithoutTrailingSlash } from '../../lib/enonic/asset/resource/path/getAbsoluteResourcePathWithoutTrailingSlash';
import {
  badRequestResponse,
  internalServerErrorResponse,
  notFoundResponse,
  okResponse
} from '../../lib/enonic/asset/response/responses';
import { generateErrorId } from '../../lib/enonic/asset/response/generateErrorId';
import { isDev } from '../../lib/enonic/asset/runMode';
import { getFingerprint } from '../../lib/enonic/asset/runMode';


export function requestHandler({
  cacheControl = configuredCacheControl(),
  request
}: {
  request: Request
  cacheControl?: string
}): Response {
  try {
    if (!request.rawPath) {
      const errorMessage = `request.rawPath is missing! request: ${JSON.stringify(request, null, 4)}`;
      if (isDev()) {
        return badRequestResponse({
          body: errorMessage,
          contentType: 'text/plain; charset=utf-8',
        });
      }
      log.error(errorMessage);
      return badRequestResponse();
    }
    log.debug('request.rawPath (1) "%s"', request.rawPath);

    const fingerprint = getFingerprint(app.name);
    log.debug('fingerprint "%s"', fingerprint);

    // when cacheBust and request contains fingerprint, remove fingerprint from path and respond 200
    // when cacheBust and request doesn't fingerprint, respond 404
    // when cacheBust and request doesn't fingerprint respond 200
    // when cacheBust and request contains fingerprint, respons 404
    const cacheBust = isCacheBust();

    // WARN: This could fail if a folder is named with the fingerprint
    const fingerprintInUrl = request.rawPath.indexOf(`/${fingerprint}/`) !== -1;

    if (cacheBust) {
      if (fingerprintInUrl) {
        request.rawPath = request.rawPath.replace(`/${fingerprint}/`, '/');
      } else {
        return notFoundResponse();
      }
    } else {
      if (fingerprintInUrl) {
        // NOTE: This should handle itself since the asset won't be found, could short circuit though.
        return notFoundResponse();
      } //else {
        // no-op
      //}
    }
    log.debug('request.rawPath (2) "%s"', request.rawPath);

    const root = configuredRoot();
    log.debug('root "%s"', root);

    const absResourcePathWithoutTrailingSlash = getAbsoluteResourcePathWithoutTrailingSlash({
      request,
      root
    });

    const errorResponse = checkPath({ absResourcePathWithoutTrailingSlash });
    if (errorResponse) {
      return errorResponse;
    }

    const resource = getResource(absResourcePathWithoutTrailingSlash);

    if (!resource.exists()) {
      return notFoundResponse();
    }

    const contentType = getMimeType(absResourcePathWithoutTrailingSlash);
    log.debug('contentType "%s"', contentType);

    if(isDev()) {
      return okResponse({
        body: resource.getStream(),
        contentType,
        headers: {
          [HTTP2_RESPONSE_HEADER.CACHE_CONTROL]: `${
            RESPONSE_CACHE_CONTROL_DIRECTIVE.PRIVATE
          }, ${
            RESPONSE_CACHE_CONTROL_DIRECTIVE.NO_STORE
          }`
        }
      });
    }

    const etagWithDblFnutts = read(absResourcePathWithoutTrailingSlash);
    log.debug('etagWithDblFnutts "%s"', etagWithDblFnutts);

    const ifNoneMatchRequestHeader = getIfNoneMatchHeader({ request })
    if (
      ifNoneMatchRequestHeader
      && ifNoneMatchRequestHeader === etagWithDblFnutts
    ) {
      return RESPONSE_NOT_MODIFIED;
    }

    const headers = {
      [HTTP2_RESPONSE_HEADER.ETAG]: etagWithDblFnutts
    };

    if (cacheControl) {
      headers[HTTP2_RESPONSE_HEADER.CACHE_CONTROL] = cacheControl;
    }

    return okResponse({
      body: resource.getStream(),
      contentType,
      headers
    });
  } catch (e) {
    const errorId = generateErrorId();
      log.error(`lib-static.handleResourceRequest, error ID: ${errorId}   |   ${e.message}`, e);
      return internalServerErrorResponse({
        contentType: 'text/plain; charset=utf-8',
        body: `Server error (logged with error ID: ${errorId})`
      });
    }
} // function requestHandler
