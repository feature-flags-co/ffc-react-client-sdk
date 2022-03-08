import { IOption } from 'ffc-js-client-side-sdk/esm/types';
import { defaultReactOptions, FfcReactOptions, FfcContext } from './types';
import ffcClient from 'ffc-js-client-side-sdk';
import { fetchFlags } from "./utils";

/**
 * Internal function to initialize the `ffc-js-client-side-sdk`.
 *
 * @param reactOptions Initialization options for the feature-flags.co React SDK
 * @param options ffc-js-client-side-sdk initialization options
 *
 * @see `ProviderConfig` for more details about the parameters
 * @return An initialized client and flags
 */
 export const initClient = async (
    reactOptions: FfcReactOptions = defaultReactOptions,
    options: IOption = { secret: '', anonymous: true }
  ): Promise<FfcContext> => {
    return new Promise<FfcContext>(resolve => {
      ffcClient.on('ready', () => {
        const flags = fetchFlags(ffcClient, reactOptions);
        resolve({ flags, ffcClient });
      });
      
      ffcClient.init({...options});
    });
  };