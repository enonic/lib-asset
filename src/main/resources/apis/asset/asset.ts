import type {Request, Response} from '@enonic-types/core';

import {requestHandler} from './requestHandler';

export const all = (request: Request): Response => {
  const method = (request.method || '').toUpperCase();
  if (method === 'GET' || method === 'HEAD') {
    return requestHandler({request});
  }
  return {status: 404};
}
