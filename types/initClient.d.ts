import { IOption } from 'ffc-js-client-side-sdk/esm/types';
import { FfcReactOptions, FfcContext } from './types';
/**
 * Internal function to initialize the `ffc-js-client-side-sdk`.
 *
 * @param reactOptions Initialization options for the feature-flags.co React SDK
 * @param options ffc-js-client-side-sdk initialization options
 *
 * @see `ProviderConfig` for more details about the parameters
 * @return An initialized client and flags
 */
export declare const initClient: (reactOptions?: FfcReactOptions, options?: IOption, cbBeforeReady?: Function | undefined) => Promise<FfcContext>;
