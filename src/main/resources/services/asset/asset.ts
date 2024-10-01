import type {
	Request,
	Response,
} from '../../lib/enonic/asset/types';

import Router from '/lib/router';
import {requestHandler} from './requestHandler';

const router = Router();

router.get('{path:.*}', (request: Request): Response => {
  return requestHandler({request});
});

export const all = (request: Request): Response => {
  return router.dispatch(request) as Response;
}
