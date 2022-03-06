import * as React from 'react';
import { defaultReactOptions, ProviderConfig } from './types';
import FfcProvider from './provider';
import hoistNonReactStatics from 'hoist-non-react-statics';

/**
 * `withFfcProvider` is a function which accepts a config object which is used to
 * initialize `ffc-js-client-side-sdk`.
 *
 * This HOC handles passing configuration to the `FfcProvider`, which does the following:
 * - It initializes the ffcClient instance by calling `ffc-js-client-side-sdk` init on `componentDidMount`
 * - It saves all flags and the ffcClient instance in the context API
 * - It subscribes to flag changes and propagate them through the context API
 *
 * The difference between `withFfcProvider` and `asyncWithFfcProvider` is that `withFfcProvider` initializes
 * `ffc-js-client-side-sdk` at `componentDidMount`. This means your flags and the ffcClient are only available after
 * your app has mounted. This can result in a flicker due to flag changes at startup time.
 *
 * `asyncWithFfcProvider` initializes `ffc-js-client-side-sdk` at the entry point of your app prior to render.
 * This means that your flags and the ffcClient are ready at the beginning of your app. This ensures your app does not
 * flicker due to flag changes at startup time.
 *
 * @param config - The configuration used to initialize feature-flags.co JS SDK
 * @return A function which accepts your root React component and returns a HOC
 */
export function withFfcProvider<T = {}>(
  config: ProviderConfig,
): (WrappedComponent: React.ComponentType<T>) => React.ComponentType<T> {
  return function withFfcProviderHoc(WrappedComponent: React.ComponentType<T>): React.ComponentType<T> {
    const { reactOptions: userReactOptions } = config;
    const reactOptions = { ...defaultReactOptions, ...userReactOptions };
    const providerProps = { ...config, reactOptions };

    class HoistedComponent extends React.Component<T> {
      render() {
        return (
          <FfcProvider {...providerProps}>
            <WrappedComponent {...this.props} />
          </FfcProvider>
        );
      }
    }

    hoistNonReactStatics(HoistedComponent, WrappedComponent);

    return HoistedComponent;
  };
}

export default withFfcProvider;