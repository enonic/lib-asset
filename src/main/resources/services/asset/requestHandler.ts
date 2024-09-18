import type {
  AcceptEncodingCompressionFormat,
  AcceptEncodingItem,
  Request
} from '../../lib/enonic/asset/types/Request';
import type { Response } from '../../lib/enonic/asset/types/Response';

import { getResource } from '/lib/xp/io';
import {
  CONTENT_CODING,
  CONTENT_ENCODING,
  HTTP2_REQUEST_HEADER,
  HTTP2_RESPONSE_HEADER,
  RESPONSE_CACHE_CONTROL_DIRECTIVE,
  VARY,
} from '../../lib/enonic/asset/constants';
import {
  configuredCacheControl,
  configuredRoot,
  doStaticCompression,
  isCacheBust,
} from '../../lib/enonic/asset/config';
import { read } from '../../lib/enonic/asset/etagReader';
import { getMimeType } from '../../lib/enonic/asset/io';
import { getIfNoneMatchHeader } from '../../lib/enonic/asset/request/getIfNoneMatchHeader';
import { checkPath } from '../../lib/enonic/asset/resource/path/checkPath';
// import { getAbsoluteResourcePathWithoutTrailingSlash } from '../../lib/enonic/asset/resource/path/getAbsoluteResourcePathWithoutTrailingSlash';
import { prefixWithRoot } from '../../lib/enonic/asset/resource/path/prefixWithRoot';
import { getRelativeResourcePath } from '../../lib/enonic/asset/resource/path/getRelativeResourcePath';
import { getRootFromPath } from '../../lib/enonic/asset/resource/path/getRootFromPath';
import {
  badRequestResponse,
  internalServerErrorResponse,
  notFoundResponse,
  notModifiedResponse,
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

    const cacheBust = isCacheBust();

    let relPath = getRelativeResourcePath(request);
    log.debug('relPath "%s"', relPath);

    const rootPath = getRootFromPath(relPath);

    if (cacheBust) {
      if (rootPath === fingerprint) {
        // Remove fingerprint from path to find the resource.
        // request.rawPath = request.rawPath.replace(`/${fingerprint}/`, '/');
        relPath = relPath.replace(`/${fingerprint}`, '');
      } else if (rootPath) {
        // Try remove the rootPath from the relPath to find the resource.
        // and set cacheControl to private, no-store
        cacheControl = `${RESPONSE_CACHE_CONTROL_DIRECTIVE.PRIVATE}, ${RESPONSE_CACHE_CONTROL_DIRECTIVE.NO_STORE}`;
        // request.rawPath = request.rawPath.replace(`/${rootPath}/`, '/');
        relPath = relPath.replace(`/${rootPath}`, '');
      } else {
        return notFoundResponse();
      }
    } else { // !cacheBust
      if (rootPath === fingerprint) {
        return notFoundResponse(); // Code below would figure this out, but short-circuiting.
      // } else if (rootPath) {
      //   // let code below figure out to return 200 or 404
      }
    }
    // log.debug('request.rawPath (2) "%s"', request.rawPath);

    const root = configuredRoot();
    log.debug('root "%s"', root);

    // const absResourcePathWithoutTrailingSlash = getAbsoluteResourcePathWithoutTrailingSlash({
    //   request,
    //   root
    // });
    const absResourcePathWithoutTrailingSlash = prefixWithRoot({
      path: relPath,
      root
    });
    log.debug('absResourcePathWithoutTrailingSlash "%s"', absResourcePathWithoutTrailingSlash);

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

    const headers = {
      [HTTP2_RESPONSE_HEADER.ETAG]: etagWithDblFnutts // undefinedin DEV mode
    };

    if (cacheControl) {
      headers[HTTP2_RESPONSE_HEADER.CACHE_CONTROL] = cacheControl;
    }

    const staticCompression = doStaticCompression();
    if (staticCompression) {
      headers[HTTP2_RESPONSE_HEADER.VARY] = VARY.ACCEPT_ENCODING;
    }

    const ifNoneMatchRequestHeader = getIfNoneMatchHeader({ request })
    if (
      ifNoneMatchRequestHeader
      && ifNoneMatchRequestHeader === etagWithDblFnutts
    ) {
      return notModifiedResponse({
        headers
      });
    }

    if (staticCompression) {
      if (request.headers?.[HTTP2_REQUEST_HEADER.ACCEPT_ENCODING]) {
        let highestWeight = 0;
        request.headers[HTTP2_REQUEST_HEADER.ACCEPT_ENCODING].split(/\s*,\s*/).forEach((encoding: AcceptEncodingItem) => {
          const [aCompression, qvalue = '1'] = encoding.split(';q=') as [AcceptEncodingCompressionFormat, string];
          const weight = parseFloat(qvalue);
          if (aCompression === CONTENT_CODING.BR) {
            const resourceBr = getResource(`${absResourcePathWithoutTrailingSlash}.br`);
            if (resourceBr.exists()) {
              if (weight > highestWeight) {
                highestWeight = weight;
                headers[HTTP2_RESPONSE_HEADER.CONTENT_ENCODING] = CONTENT_ENCODING.BR;
                if (etagWithDblFnutts) {
                  headers[HTTP2_RESPONSE_HEADER.ETAG] = etagWithDblFnutts.replace(/"$/, '-br"');
                }
              }
            }
          } else if (aCompression === CONTENT_CODING.GZIP) {
            const resourceGz = getResource(`${absResourcePathWithoutTrailingSlash}.gz`);
            if (resourceGz.exists()) {
              if (weight > highestWeight) {
                highestWeight = weight;
                headers[HTTP2_RESPONSE_HEADER.CONTENT_ENCODING] = CONTENT_ENCODING.GZIP;
                if (etagWithDblFnutts) {
                  headers[HTTP2_RESPONSE_HEADER.ETAG] = etagWithDblFnutts.replace(/"$/, '-gzip"');
                }
              }
            }
          }
        }); // forEach compression
      } // if accept-encoding
    } // if doStaticCompression

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
