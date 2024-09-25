import type {StepDefinitions} from 'jest-cucumber';
import type {Config} from '../../main/resources/lib/enonic/asset/config';
import type {AssetUrlParams} from '../../main/resources/lib/enonic/asset/assetUrl';

import {describe} from '@jest/globals';
import {
  expect,
  test,
} from 'bun:test';
import {
  autoBindSteps,
  loadFeature,
  // setJestCucumberConfiguration
} from 'jest-cucumber';
import {assetUrl} from '../../main/resources/lib/enonic/asset/assetUrl';

// Avoid type errors
declare namespace globalThis {
  let _resources: Record<string, {
    bytes?: string
    exists?: boolean
    etag?: string
    mimeType?: string
  }>
}

// setJestCucumberConfiguration({});

const feature = loadFeature('./src/bun/features/assetUrl.feature', {
  runner: {
    describe,
    test,
  },
});

export const steps: StepDefinitions = ({given, and, when, then}) => {
  let assetUrlParams: Partial<AssetUrlParams> = {};
  let assetUrlReturnValue: string;

  given('there is no configuration file', () => {
    globalThis._resources['/com.enonic.lib.asset.json'] = {
      exists: false,
    };
  });

  given('The following configuration:', (table: {option: string, value: unknown}[]) => {
    const configFromJson = JSON.parse(globalThis._resources['/com.enonic.lib.asset.json'].bytes || '{}') as Partial<Config>;
    // log.debug('table:%s', table);
    table.forEach(({option, value}) => {
      // log.debug('option:%s value:%s', option, value);
      configFromJson[option] = value;
    });
    globalThis._resources['/com.enonic.lib.asset.json'] = {
      bytes: JSON.stringify(configFromJson),
      exists: true,
      mimeType: 'application/json',
    };
  });

  // given('fingerprint is disabled in the configuration file', () => {
  //   let configFromJson = {
  //     fingerprint: false
  //   };
  //   if (globalThis._resources['/com.enonic.lib.asset.json']?.exists) {
  //     configFromJson = JSON.parse(globalThis._resources['/com.enonic.lib.asset.json'].bytes || '{}');
  //     configFromJson.fingerprint = false;
  //   }
  //   globalThis._resources['/com.enonic.lib.asset.json'] = {
  //     bytes: JSON.stringify(configFromJson),
  //     exists: true,
  //     mimeType: 'application/json'
  //   };
  // });

  when(/^I call assetUrl with the path "(.*)"$/, (path: string) => {
    assetUrlParams.path = path;
    assetUrlReturnValue = assetUrl(assetUrlParams as AssetUrlParams);
  });

  when('I call assetUrl with the following parameters:', (table: {parameter: string, value: unknown}[]) => {
    assetUrlParams = {};
    // log.debug('table:%s', table);
    table.forEach(({parameter, value}) => {
      if (parameter === 'params') {
        assetUrlParams.params = JSON.parse(value as string) as Record<string, unknown>;
      } else if (parameter === 'path') {
        assetUrlParams.path = value as string;
      } else if (parameter === 'type') {
        assetUrlParams.type = value as 'server' | 'absolute';
      }
    });
    if (Object.keys(assetUrlParams).length) {
      assetUrlReturnValue = assetUrl(assetUrlParams as AssetUrlParams);
    } else {
      assetUrlReturnValue = assetUrl();
    }
  });

  then(/^I should get the following url "(.*)"$/, (url) => {
    expect(assetUrlReturnValue).toStrictEqual(url);
  });
}; // steps

autoBindSteps(feature, [steps]);
