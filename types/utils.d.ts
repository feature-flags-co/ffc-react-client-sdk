import { Ffc } from 'ffc-js-client-side-sdk';
import { IFeatureFlagSet, IFeatureFlagChange } from 'ffc-js-client-side-sdk/esm/types';
import { FfcReactOptions } from './types';
/**
 * Transforms a set of flags so that their keys are camelCased. This function ignores
 * flag keys which start with `$`.
 *
 * @param rawFlags A mapping of flag keys and their values
 * @return A transformed `FfcFlagSet` with camelCased flag keys
 */
export declare const camelCaseKeys: (rawFlags: IFeatureFlagSet) => IFeatureFlagSet;
/**
* Gets the flags to pass to the provider from the changeset.
*
* @param changes the `LDFlagChangeset` from the ldClient onchange handler.
* @param reactOptions reactOptions.useCamelCaseFlagKeys determines whether to change the flag keys to camelCase
* @return an `LDFlagSet` with the current flag values from the LDFlagChangeset filtered by `targetFlags`. The returned
* object may be empty `{}` if none of the targetFlags were changed.
*/
export declare const getFlattenedFlagsFromChangeset: (changes: IFeatureFlagChange[], reactOptions: FfcReactOptions) => IFeatureFlagSet;
/**
* Retrieves flag values.
*
* @param ffcClient feature-flags.co client
* @param reactOptions Initialization options for the React SDK
*
* @returns an `IFeatureFlagSet` with the current flag values from feature-flags.co.
*/
export declare const fetchFlags: (ffcClient: Ffc, reactOptions?: FfcReactOptions) => IFeatureFlagSet;
declare const _default: {
    camelCaseKeys: (rawFlags: IFeatureFlagSet) => IFeatureFlagSet;
    getFlattenedFlagsFromChangeset: (changes: IFeatureFlagChange[], reactOptions: FfcReactOptions) => IFeatureFlagSet;
    fetchFlags: (ffcClient: Ffc, reactOptions?: FfcReactOptions) => IFeatureFlagSet;
};
export default _default;
