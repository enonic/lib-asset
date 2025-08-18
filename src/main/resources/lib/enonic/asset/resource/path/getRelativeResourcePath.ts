import type {Request} from '../../types';

// import {isStringLiteral} from '../../util/isStringLiteral';


export const ERROR_MESSAGE_REQUEST_RAWPATH_DOES_NOT_STARTWITH_REMOVEPREFIX = "Default functionality can't resolve relative asset path: the request was expected to contain a .contextPath string attribute that is a prefix in a .rawPath string attribute. You may need to supply a getCleanPath(request) function parameter to extract a relative asset path from the request.";

/* .buildGetter helper: creates a resource path from the request, relative to the root folder (which will be prefixed later).
*  Overridable with the getCleanPath option param. */
export const getRelativeResourcePath = (request: Request): string => {
  const {contextPath} = (request || {});
  let {rawPath} = (request || {});
  let removePrefix = (contextPath || '').trim() || '** missing or falsy **';

  // Normalize: remove leading slashes from both
  rawPath = rawPath.replace(/^\/+/, '');
  removePrefix = removePrefix.replace(/^\/+/, '');

  if (!rawPath.startsWith(removePrefix)) {
    // Gives 500-type error
    throw Error(`${ERROR_MESSAGE_REQUEST_RAWPATH_DOES_NOT_STARTWITH_REMOVEPREFIX} Request: ${JSON.stringify(request)}`);
  }

  return rawPath
    .trim()
    .substring(removePrefix.length)
};
