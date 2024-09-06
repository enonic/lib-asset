import type { Request } from '../types';

import { lcKeys } from '../util/lcKeys';


export function getLowerCasedHeaders({
  request
}: {
  request: Request
}) {
  const {
    headers: mixedCaseRequestHeaders = {},
  } = request;

  return lcKeys(mixedCaseRequestHeaders);
}
