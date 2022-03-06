import { Ffc } from 'ffc-js-client-side-sdk';
import { IFeatureFlagSet, IOption } from 'ffc-js-client-side-sdk/esm/types';

export interface FfcContext {
  flags: IFeatureFlagSet;
  ffcClient: Ffc
}

/**
 * Initialization options for the Ffc React SDK. These are in addition to the options exposed
 * by [[IOption]] which are common to both the JavaScript and React SDKs.
 */
 export interface FfcReactOptions {
    /**
     * Whether the React SDK should transform flag keys into camel-cased format.
     * Using camel-cased flag keys allow for easier use as prop values, however,
     * these keys won't directly match the flag keys as known to LaunchDarkly.
     * Consequently, flag key collisions may be possible and the Code References feature
     * will not function properly.
     *
     * This is false by default, meaning that keys will automatically be converted to camel-case.
     */
    useCamelCaseFlagKeys?: boolean;
  }
  
  /**
   * Contains default values for the `reactOptions` object.
   */
  export const defaultReactOptions = { useCamelCaseFlagKeys: false };
  
  /**
   * Configuration object used to initialise Ffc's JS client.
   */
  export interface ProviderConfig {  
    /**
     * If set to true, the Ffc will not be initialized until the option prop has been defined.
     */
    deferInitialization?: boolean;
  
    /**
     * Ffc initialization options. These options are common between Ffc's JavaScript and React SDKs.
     */
    options?: IOption;
  
    /**
     * Additional initialization options specific to the React SDK.
     *
     * @see options
     */
    reactOptions?: FfcReactOptions;
  
    /**
     * Optionally, the ffc can be initialised outside of the provider
     * and passed in, instead of being initialised by the provider.
     * Note: it should only be passed in when it has emitted the 'ready'
     * event, to ensure that the flags are properly set.
     */
    ffcClient?: Ffc;
  }

  /**
 * The return type of withFfcProvider HOC. Exported for testing purposes only.
 *
 * @ignore
 */
export interface EnhancedComponent extends React.Component {
  subscribeToChanges(ffcClient: Ffc): void;
  // tslint:disable-next-line:invalid-void
  componentDidMount(): Promise<void>;
  // tslint:disable-next-line:invalid-void
  componentDidUpdate(prevProps: ProviderConfig): Promise<void>;
}