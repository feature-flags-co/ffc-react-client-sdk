import React, { useState, useEffect, FunctionComponent } from 'react';
import { ProviderConfig, defaultReactOptions } from './types';
import { Provider } from './context';
import { initClient } from './initClient';
import { camelCaseKeys, fetchFlags, getFlattenedFlagsFromChangeset } from './utils';
import ffcClient from 'ffc-js-client-side-sdk';
import { IFeatureFlagChange, IFeatureFlagSet } from 'ffc-js-client-side-sdk/esm/types';

/**
 * This is an async function which initializes feature-flags.co's JS SDK (`ffc-js-client-side-sdk`)
 * and awaits it so all flags and the ffcClient are ready before the consumer app is rendered.
 *
 * The difference between `withFfcProvider` and `asyncWithFfcProvider` is that `withFfcProvider` initializes
 * `ffc-js-client-side-sdk` at componentDidMount. This means your flags and the ffcClient are only available after
 * your app has mounted. This can result in a flicker due to flag changes at startup time.
 *
 * `asyncWithFfcProvider` initializes `ffc-js-client-side-sdk` at the entry point of your app prior to render.
 * This means that your flags and the ffcClient are ready at the beginning of your app. This ensures your app does not
 * flicker due to flag changes at startup time.
 *
 * `asyncWithFfcProvider` accepts a config object which is used to initialize `ffc-js-client--side-sdk`.
 *
 * `asyncWithFfcProvider` does not support the `deferInitialization` config option because `asyncWithFfcProvider` needs
 * to be initialized at the entry point prior to render to ensure your flags and the ffcClient are ready at the beginning
 * of your app.
 *
 * It returns a provider which is a React FunctionComponent which:
 * - saves all flags and the ldClient instance in the context API
 * - subscribes to flag changes and propagate them through the context API
 *
 * @param config - The configuration used to initialize feature-flags.co's JS SDK
 */
export default async function asyncWithFfcProvider(config: ProviderConfig): Promise<FunctionComponent> {
  const { options, reactOptions: userReactOptions } = config;
  const reactOptions = { ...defaultReactOptions, ...userReactOptions };
  await initClient(reactOptions, options);

  const FfcProvider: FunctionComponent = ({ children }) => {
    const [state, setState] = useState({
      flags: new Proxy(fetchFlags(ffcClient, reactOptions), {
                get(target, prop, receiver) {
                    const ret = Reflect.get(target, prop, receiver);
                    ffcClient.sendFeatureFlagInsight(prop as string, ret);
                    return ret;
                }
              }),
      ffcClient,
    });

    useEffect(() => {
      if (options) {
        const { bootstrap } = options;
        if (bootstrap && bootstrap.length > 0) {
          const bootstrappedFlags = reactOptions.useCamelCaseFlagKeys ? camelCaseKeys(bootstrap) : bootstrap;
          setState(prev => ({ ...prev, flags: bootstrappedFlags }));
        }
      }

      ffcClient.on('ff_update', (changes: IFeatureFlagChange[]) => {
        const flattened: IFeatureFlagSet = getFlattenedFlagsFromChangeset(changes, reactOptions);
        if (Object.keys(flattened).length > 0) {
          setState(prev => {
            const flags = Object.keys(flattened).reduce((acc, curr) => {
              acc[curr] = flattened[curr];
              return acc;
            }, prev.flags);
  
            return {
              flags: new Proxy(flags, {
                get(target, prop, receiver) {
                    const ret = Reflect.get(target, prop, receiver);
                    ffcClient.sendFeatureFlagInsight(prop as string, ret);
                    return ret;
                }
              }),
              ffcClient
            };
          });
        }
      });
    }, []);

    return <Provider value={state}>{children}</Provider>;
  };

  return FfcProvider;
}