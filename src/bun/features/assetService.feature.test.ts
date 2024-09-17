import type { StepDefinitions } from 'jest-cucumber';
import type {
	Request,
	Response,
} from '../../main/resources/lib/enonic/asset/types';

import { describe } from '@jest/globals';
import {
  expect,
  test
} from 'bun:test';
import {
  autoBindSteps,
  loadFeature,
} from 'jest-cucumber';
// import { all } from '../../main/resources/services/asset/asset';
import { requestHandler } from '../../main/resources/services/asset/requestHandler';
// import { readText } from '@enonic-types/lib-io';

const feature = loadFeature('./src/bun/features/assetService.feature', {
  runner: {
    describe,
    test,
  }
});

export const steps: StepDefinitions = ({ given, and, when, then }) => {
  let request: Partial<Request> = {
    // Uncertain whether headers are optional, but it's good for the code to handle missing headers, just in case
    // headers: {},
  };
  let response: Response;

  given('enonic is running in development mode', () => {
    globalThis._devMode = true;
  });

  given('enonic is running in production mode', () => {
    globalThis._devMode = false;
  });

  given('the following resources:', (table) => {
    Object.keys(globalThis._resources).forEach((key) => {
      delete globalThis._resources[key];
    });
    table.forEach(({ path, exist, mimeType, etag, content }) => {
      globalThis._resources[path] = {
        exists: exist !== 'false',
      };
      if (content) {
        globalThis._resources[path].bytes = content;
      }
      if (etag) {
        globalThis._resources[path].etag = etag;
      }
      if (mimeType) {
        globalThis._resources[path].mimeType = mimeType;
      }
    });
    // log.info('resources:%s', globalThis._resources);
	});

  given('the following request:', (table) => {
    request = {
      // Uncertain whether headers are optional, but it's good for the code to handle missing headers, just in case
      // headers: {},
    };
    table.forEach(({ property, value }) => {
      request[property] = value;
    });
	});

  and('the following request headers:', (table) => {
    request.headers = {};
    table.forEach(({ header, value }) => {
      request.headers[header] = value;
    });
	});

  then('the resources are info logged', () => {
    log.info('resources:%s', globalThis._resources);
	});

  then('debug the request', () => {
    log.debug('request:%s', request);
	});

  then('log info the request', () => {
    log.info('request:%s', request);
	});

  when('the request is sent', () => {
    response = requestHandler({request: request as Request});
	});

  then('debug the response', () => {
    log.debug('response:%s', response);
	});

  then('log info the response', () => {
    log.info('response:%s', response);
	});

  then('the response should have the following properties:', (table) => {
    table.forEach(({ property, value }) => {
      // if (value === 'undefined') {
      //   value = undefined;
      // }
      if (property === 'status') {
        expect(response[property]).toStrictEqual(Number.parseInt(value));
      } else if (property === 'body') {
        expect(response[property]).toStrictEqual(value);
        // const stream = response[property];
        // const text = readText(stream);
        // expect(text).toStrictEqual(value);
      } else {
        expect(response[property]).toStrictEqual(value);
      }
    });
	});

  then('the response should have the following headers:', (table) => {
    table.forEach(({ header, value }) => {
      if (value === 'undefined') {
        value = undefined;
      }
      // if (value === 'null') {
      //   value = null;
      // }
      expect(response.headers[header]).toStrictEqual(value);
    });
	});

  and(/^the response body should start with "(.*)"$/, (prefix) => {
    expect((response.body as string).startsWith(prefix)).toBe(true);
  })
}; // steps

autoBindSteps(feature, [ steps ]);
