import * as React from 'react';
import { Consumer, FfcContext } from './context';
import { Ffc } from 'ffc-js-client-side-sdk';
import { IFeatureFlagSet } from 'ffc-js-client-side-sdk/esm/types';

/**
 * Controls the props the wrapped component receives from the `FfcConsumer` HOC.
 */
export interface ConsumerOptions {
  /**
   * If true then the wrapped component only receives the `ffcClient` instance
   * and nothing else.
   */
  clientOnly: boolean;
}

/**
 * The possible props the wrapped component can receive from the `FfcConsumer` HOC.
 */
export interface FfcProps {
  /**
   * A map of feature flags from their keys to their values.
   * Keys are camelCased using `lodash.camelcase`.
   */
  flags?: IFeatureFlagSet;

  /**
   * An instance of `Ffc` from the feature-flags.co JS SDK (`ffc-js-client-side-sdk`)
   */
  ffcClient?: Ffc;
}

/**
 * withFfcConsumer is a function which accepts an optional options object and returns a function
 * which accepts your React component. This function returns a HOC with flags
 * and the Ffc instance injected via props.
 *
 * @param options - If you need only the `ffcClient` instance and not flags, then set `{ clientOnly: true }`
 * to only pass the ffcClient prop to your component. Defaults to `{ clientOnly: false }`.
 * @return A HOC with flags and the `ffcClient` instance injected via props
 */
function withFfcConsumer(options: ConsumerOptions = { clientOnly: false }) {
  return function withFfcConsumerHoc<P>(WrappedComponent: React.ComponentType<P & FfcProps>) {
    return (props: P) => (
      <Consumer>
        {({ flags, ffcClient }: FfcContext) => {
          if (options.clientOnly) {
            return <WrappedComponent ffcClient={ffcClient} {...props} />;
          }

          return <WrappedComponent flags={flags} ffcClient={ffcClient} {...props} />;
        }}
      </Consumer>
    );
  };
}

export default withFfcConsumer;