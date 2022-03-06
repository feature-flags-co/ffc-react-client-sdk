import React from 'react';
import { ProviderConfig } from './types';
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
export default function asyncWithFfcProvider(config: ProviderConfig): Promise<React.FunctionComponent<{}>>;
