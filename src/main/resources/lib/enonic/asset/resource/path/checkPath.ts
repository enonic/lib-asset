import type {Response} from '../../types';

import {badRequestResponse} from '../../response/responses';
import {isDev} from '../../runMode';
import {getPathError} from './getPathError';


export function checkPath({
  absResourcePathWithoutTrailingSlash,
}: {
  absResourcePathWithoutTrailingSlash: string
}): Response | void {
  const pathError = getPathError(absResourcePathWithoutTrailingSlash.replace(/^\/+/, ''));
  log.debug('checkPath: pathError: %s', pathError);

  if (pathError) {
    if (isDev()) {
      return badRequestResponse({
        body: pathError,
        contentType: 'text/plain; charset=utf-8',
      });
    }
    log.warning(pathError);
    return badRequestResponse();
  }
}
