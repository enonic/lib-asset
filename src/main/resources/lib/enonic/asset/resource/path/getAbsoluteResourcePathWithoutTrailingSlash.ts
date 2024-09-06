import type {
  Request,
} from '../../types';

import { getRelativeResourcePath } from './getRelativeResourcePath';
import { prefixWithRoot } from './prefixWithRoot';


export function getAbsoluteResourcePathWithoutTrailingSlash({
  request,
  root // default is set and checked in prefixWithRoot
}: {
  request: Request
  root?: string
}) {
  const path = getRelativeResourcePath(request);
  log.debug('handleResourceRequest: relFilePath: %s', path);

  return prefixWithRoot({
    path,
    root
  });
}
