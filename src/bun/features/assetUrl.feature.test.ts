import type { StepDefinitions } from 'jest-cucumber';
import type { Config } from '../../main/resources/lib/enonic/asset/config';
import type { AssetUrlParams } from '../../main/resources/lib/enonic/asset/assetUrl';

import { describe } from '@jest/globals';
import {
  expect,
  test
} from 'bun:test';
import {
  autoBindSteps,
  loadFeature,
  // setJestCucumberConfiguration
} from 'jest-cucumber';
import { assetUrl } from '../../main/resources/lib/enonic/asset/assetUrl';

// setJestCucumberConfiguration({});

const feature = loadFeature('./src/bun/features/assetUrl.feature', {
  runner: {
    describe,
    test,
  }
});

export const steps: StepDefinitions = ({ given, and, when, then }) => {
  let config: Partial<Config>;
  let assetUrlReturnValue: string;

  given('there is no configuration file', () => {
    // no-op
  });

  given('fingerprint is disabled', () => {
    if (!config) {
      config = {};
    }
    config.fingerprint = false;
  });

  when(/^I call assetUrl with the path "(.*)"$/, (path) => {
    let fingerprinting = true;
    if (config && config.fingerprint !== undefined) {
      fingerprinting = config.fingerprint;
    }
    assetUrlReturnValue = assetUrl({
      fingerprinting,
      path,
    });
  });

  when('I call assetUrl with the following parameters:', (table: {parameter: string, value: unknown}[]) => {
    // log.debug('table:%s', table);
    let fingerprinting = true;
    if (config && config.fingerprint !== undefined) {
      fingerprinting = config.fingerprint;
    }
    let application: AssetUrlParams['application'];
    let params: AssetUrlParams['params'];
    let path: AssetUrlParams['path'] = '';
    let type: AssetUrlParams['type'];
    table.forEach(({ parameter, value }) => {
      if (parameter === 'application') {
        application = value as string;
      } else if (parameter === 'fingerprinting') {
        fingerprinting = value === 'true';
      } else if (parameter === 'params') {
        params = JSON.parse(value as string) as Record<string, unknown>;
      } else if (parameter === 'path') {
        path = value as string;
      } else if (parameter === 'type') {
        type = value as 'server' | 'absolute';
      }
    });
    assetUrlReturnValue = assetUrl({
      application,
      fingerprinting,
      params,
      path,
      type
    });
  });

  then(/^I should get the following url "(.*)"$/, (url) => {
    expect(assetUrlReturnValue).toStrictEqual(url);
  });
}; // steps

autoBindSteps(feature, [ steps ]);
