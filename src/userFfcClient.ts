import { useContext } from 'react';
import context from './context';

// tslint:disable:max-line-length
/**
 * `useFfcClient` is a custom hook which returns the underlying [feature-flags.co JavaScript SDK client object](https://github.com/feature-flags-co/ffc-js-client-side-sdk).
 * Like the `useFlags` custom hook, `useFfcClient` also uses the `useContext` primitive to access the feature-flags.co
 * context set up by `withFfcProvider`. You will still need to use the `withFfcProvider` HOC
 * to initialise the react sdk to use this custom hook.
 *
 * @return The `ffc-js-client-side-sdk` `Ffc` object
 */
// tslint:enable:max-line-length
const useFfcClient = () => {
  const { ffcClient } = useContext(context);

  return ffcClient;
};

export default useFfcClient;