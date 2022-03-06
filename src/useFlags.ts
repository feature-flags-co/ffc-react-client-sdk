import { useContext } from 'react';
import context from './context';

/**
 * `useFlags` is a custom hook which returns all feature flags. It uses the `useContext` primitive
 * to access the feature-flags.co context set up by `withFfcProvider`. As such you will still need to
 * use the `withFfcProvider` HOC at the root of your app to initialize the React SDK and populate the
 * context with `ffcClient` and your flags.
 *
 * @return All the feature flags configured in your feature-flags.co project
 */
const useFlags = () => {
  const { flags } = useContext(context);

  return flags;
};

export default useFlags;