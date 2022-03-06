import ffcClient, { Ffc } from 'ffc-js-client-side-sdk';
import React from "react";
import { EnhancedComponent, ProviderConfig, defaultReactOptions } from './types';
import { Provider, FfcContext as HocState } from './context';
import { camelCaseKeys, fetchFlags, getFlattenedFlagsFromChangeset } from "./utils";
import { initClient } from './initClient';
import { IFeatureFlagChange, IFeatureFlagSet } from 'ffc-js-client-side-sdk/esm/types';

/**
 * The `FfcProvider` is a component which accepts a config object which is used to
 * initialize `ffc-js-client-side-sdk`.
 *
 * This Provider does three things:
 * - It initializes the Ffc instance by calling `ffc-js-client-side-sdk` init on `componentDidMount`
 * - It saves all flags and the Ffc instance in the context API
 * - It subscribes to flag changes and propagate them through the context API
 *
 * Because the `ffc-js-client-side-sdk` is only initialized on `componentDidMount`, your flags and the
 * Ffc are only available after your app has mounted. This can result in a flicker due to flag changes at
 * startup time.
 *
 * This component can be used as a standalone provider. However, be mindful to only include the component once
 * within your application. This provider is used inside the `withFfcProviderHOC` and can be used instead to initialize
 * the `ffc-js-client-side-sdk`. For async initialization, check out the `asyncWithFfcProvider` function
 */
 class FfcProvider extends React.Component<ProviderConfig, HocState> implements EnhancedComponent {
    readonly state: Readonly<HocState>;
  
    constructor(props: ProviderConfig) {
      super(props);
  
      const { options } = props;
  
      this.state = {
        flags: {},
        ffcClient: ffcClient,
      };
  
      if (options) {
        const { bootstrap } = options;
        if (bootstrap && bootstrap.length > 0) {
          const { useCamelCaseFlagKeys } = this.getReactOptions();
          const flags = useCamelCaseFlagKeys ? camelCaseKeys(bootstrap) : bootstrap;
          this.state = {
            flags,
            ffcClient: ffcClient,
          };
        }
      }
    }
  
    getReactOptions = () => ({ ...defaultReactOptions, ...this.props.reactOptions });
  
    subscribeToChanges = (ffcClient: Ffc) => {
      ffcClient.on('ff_update', (changes: IFeatureFlagChange[]) => {
        const flattened: IFeatureFlagSet = getFlattenedFlagsFromChangeset(changes, this.getReactOptions());
        if (Object.keys(flattened).length > 0) {
          //this.setState(({ flags }) => ({ flags: { ...flags, ...flattened } }));

          const flags = changes.reduce((acc, curr) => {
            acc[curr.id] = curr.newValue;
            return acc;
        }, this.state.flags);
          this.setState({flags: new Proxy(flattened, {
              get(target, prop, receiver) {
                  const ret = Reflect.get(target, prop, receiver);
                  ffcClient.sendFeatureFlagInsight(prop as string, ret);
                  return ret;
              }
          })})
        }
      });
    };
  
    init = async () => {
      const { options } = this.props;
      let client: Ffc = this.props.ffcClient!;
      const reactOptions = this.getReactOptions();
      let fetchedFlags;
      if (client) {
        fetchedFlags = fetchFlags(client, reactOptions);
      } else {
        client = ffcClient;
        const initialisedOutput = await initClient(reactOptions, options, () => {
          this.subscribeToChanges(client);
        });
        fetchedFlags = initialisedOutput.flags;
        client = initialisedOutput.ffcClient;
      }
      this.setState({ flags: fetchedFlags, ffcClient: client });
    };
  
    async componentDidMount() {
      const { options, deferInitialization } = this.props;
      if (deferInitialization && !options) {
        return;
      }
  
      await this.init();
    }
  
    async componentDidUpdate(prevProps: ProviderConfig) {
      const { options, deferInitialization } = this.props;
      const userJustLoaded = !prevProps.options?.user && options?.user;
      if (deferInitialization && userJustLoaded) {
        await this.init();
      }
    }
  
    render() {
      return <Provider value={this.state}>{this.props.children}</Provider>;
    }
  }

  export default FfcProvider;