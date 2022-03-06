import { Ffc } from 'ffc-js-client-side-sdk';
import React from "react";
import { EnhancedComponent, ProviderConfig } from './types';
import { FfcContext as HocState } from './context';
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
declare class FfcProvider extends React.Component<ProviderConfig, HocState> implements EnhancedComponent {
    readonly state: Readonly<HocState>;
    constructor(props: ProviderConfig);
    getReactOptions: () => {
        useCamelCaseFlagKeys: boolean;
    };
    subscribeToChanges: (ffcClient: Ffc) => void;
    init: () => Promise<void>;
    componentDidMount(): Promise<void>;
    componentDidUpdate(prevProps: ProviderConfig): Promise<void>;
    render(): JSX.Element;
}
export default FfcProvider;
