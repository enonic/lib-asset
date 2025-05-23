import type {Request, Response} from '@enonic-types/core';

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
import {read} from '../../lib/enonic/asset/etagReader';
import {getMimeType, getResource} from '../../lib/enonic/asset/io';
import {getLowerCasedHeaders} from '../../lib/enonic/asset/request/getLowerCasedHeaders';
import {checkPath} from '../../lib/enonic/asset/resource/path/checkPath';
import {prefixWithRoot} from '../../lib/enonic/asset/resource/path/prefixWithRoot';
import {getRelativeResourcePath} from '../../lib/enonic/asset/resource/path/getRelativeResourcePath';
import {getRootFromPath} from '../../lib/enonic/asset/resource/path/getRootFromPath';
import {
  internalServerErrorResponse,
  notFoundResponse,
  notModifiedResponse,
  okResponse,
} from '../../lib/enonic/asset/response/responses';
import {generateErrorId} from '../../lib/enonic/asset/response/generateErrorId';
import {getFingerprint, isDev} from '../../lib/enonic/asset/runMode';
import {stringEndsWith} from '../../lib/enonic/asset/util/stringEndsWith';
import {stringIncludes} from '../../lib/enonic/asset/util/stringIncludes';

interface RequestVerifierHandler {
  verify(): boolean;
}

const verifier: RequestVerifierHandler = __.newBean<RequestVerifierHandler>('com.enonic.lib.asset.RequestVerifierHandler');

export function requestHandler({
  cacheControl = configuredCacheControl(),
  request,
}: {
  request: Request
  cacheControl?: string
}): Response {
  try {
    if (!verifier.verify()) {
      return notFoundResponse();
    }

    const fingerprint = getFingerprint(app.name);
    log.debug('fingerprint "%s"', fingerprint);

    const cacheBust = isCacheBust();

    let relPath = getRelativeResourcePath(request);
    log.debug('relPath "%s"', relPath);

    const rootPath = getRootFromPath(relPath);
    log.debug('rootPath "%s"', rootPath);

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

    log.debug('relPath2 "%s"', relPath);
    const absResourcePathWithoutTrailingSlash: string = prefixWithRoot({
      path: relPath,
      root,
    });
    log.debug('absResourcePathWithoutTrailingSlash "%s"', absResourcePathWithoutTrailingSlash);

    const errorResponse = checkPath({absResourcePathWithoutTrailingSlash});
    if (errorResponse) {
      return errorResponse;
    }

    let resource = getResource(absResourcePathWithoutTrailingSlash);

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
          }`,
        },
      });
    }

    const etagWithDblFnutts = read(absResourcePathWithoutTrailingSlash);

    const headers = {
      [HTTP2_RESPONSE_HEADER.ETAG]: etagWithDblFnutts, // undefinedin DEV mode
    };

    if (cacheControl) {
      headers[HTTP2_RESPONSE_HEADER.CACHE_CONTROL] = cacheControl;
    }

    const staticCompression = doStaticCompression();

    if (staticCompression) {
      headers[HTTP2_RESPONSE_HEADER.VARY] = VARY.ACCEPT_ENCODING;
    }

    const lowerCasedRequestHeaders = getLowerCasedHeaders({request});

    const ifNoneMatchRequestHeader = lowerCasedRequestHeaders[HTTP2_REQUEST_HEADER.IF_NONE_MATCH] as string | undefined;
    if (
      ifNoneMatchRequestHeader
      && ifNoneMatchRequestHeader === etagWithDblFnutts
    ) {
      return notModifiedResponse({
        headers,
      });
    }

    const trimmedAndLowercasedAcceptEncoding: string = (lowerCasedRequestHeaders[HTTP2_REQUEST_HEADER.ACCEPT_ENCODING] as string | undefined || '')
      .trim()
      .toLowerCase();
    if (staticCompression && trimmedAndLowercasedAcceptEncoding) {

      if (
        stringIncludes(trimmedAndLowercasedAcceptEncoding, CONTENT_CODING.BR)
        && !stringIncludes(trimmedAndLowercasedAcceptEncoding, `${CONTENT_CODING.BR};q=0,`)
        && !stringEndsWith(trimmedAndLowercasedAcceptEncoding, `${CONTENT_CODING.BR};q=0`)
      ) {
          const resourceBr = getResource(`${absResourcePathWithoutTrailingSlash}.br`);
          if (resourceBr.exists()) {
            headers[HTTP2_RESPONSE_HEADER.CONTENT_ENCODING] = CONTENT_ENCODING.BR;
            if (etagWithDblFnutts) {
              headers[HTTP2_RESPONSE_HEADER.ETAG] = etagWithDblFnutts.replace(/"$/, '-br"');
            }
            resource = resourceBr;
          }
        } // brotli

        if (
          !headers[HTTP2_RESPONSE_HEADER.CONTENT_ENCODING] // prefer brotli
          && stringIncludes(trimmedAndLowercasedAcceptEncoding, CONTENT_CODING.GZIP)
          && !stringIncludes(trimmedAndLowercasedAcceptEncoding, `${CONTENT_CODING.GZIP};q=0,`)
          && !stringEndsWith(trimmedAndLowercasedAcceptEncoding, `${CONTENT_CODING.GZIP};q=0`)
        ) {
          const resourceGz = getResource(`${absResourcePathWithoutTrailingSlash}.gz`);
          if (resourceGz.exists()) {
            headers[HTTP2_RESPONSE_HEADER.CONTENT_ENCODING] = CONTENT_ENCODING.GZIP;
            if (etagWithDblFnutts) {
              headers[HTTP2_RESPONSE_HEADER.ETAG] = etagWithDblFnutts.replace(/"$/, '-gzip"');
            }
            resource = resourceGz;
          }
        } // gzip

    } // if doStaticCompression && acceptEncoding

    return okResponse({
      body: resource.getStream(),
      contentType,
      headers,
    });
  } catch (e) {
    const errorId = generateErrorId();
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    log.error(`lib-static.handleResourceRequest, error ID: ${errorId}   |   ${errorMessage}`, e);
    return internalServerErrorResponse({
      contentType: 'text/plain; charset=utf-8',
      body: `Server error (logged with error ID: ${errorId})`,
    });
  }
} // function requestHandler
