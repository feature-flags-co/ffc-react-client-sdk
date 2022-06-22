# React client side SDK
>If you are using react with redux or Jotai as state management library, you may want to check the following demos, they are using [ffc-js-client-side-sdk](https://github.com/feature-flags-co/ffc-js-client-side-sdk) directly instead of the current react sdk.
>1. [React with redux](https://github.com/feature-flags-co/ffc-js-client-side-sdk-react-redux-demo)
>2. [React with Jotai](https://github.com/feature-flags-co/ffc-js-client-side-sdk-react-jotai-demo)

Check this [repository](https://github.com/feature-flags-co/ffc-react-client-sdk-demo) for an demo

## Introduction
This is the react client side SDK for the feature management platform [featureflag.co](https://www.featureflag.co). We will document all the methods available in this SDK, and detail how they work.

> Be aware, this is a client side SDK, it is intended for use in a single-user context, which can be mobile, desktop or embeded applications. This SDK can only be ran in a browser environment, it is not suitable for React Native projects, React Native SDK will be available in our other repo.

The React SDK is based on the JavaScript SDK  
The React SDK builds on feature-flags.co's JavaScript SDK to provide a better integration for use in React applications. As a result, much of the JavaScript SDK functionality is also available for the React SDK to use. 
Here are some useful topics:

- [Initializing the JavaScript client SDK](https://github.com/feature-flags-co/ffc-js-client-side-sdk#initializing-the-sdk)
- [Activating developer mode](https://github.com/feature-flags-co/ffc-js-client-side-sdk#developer-mode)
- [Bootstraping with feature flags](https://github.com/feature-flags-co/ffc-js-client-side-sdk#developer-mode)
- [Switching to another user](https://github.com/feature-flags-co/ffc-js-client-side-sdk#set-the-user-after-initialization)

The **ffcClient** in the current doc is the same object as **Ffc** in the ffc-js-client-side-sdk.
To learn more about our JavaScript client SDK, please go to this repository [ffc-js-client-side-sdk](https://github.com/feature-flags-co/ffc-js-client-side-sdk)

> SDK version compatibility  
The React SDK is compatible with React version 16.3.0 and higher.
The React SDK offers two custom hooks. If you want to use these, then you must use React version 16.8.0 or higher. To learn more, read the section [Using Hooks](#using-hooks).

## Getting started
### Install
npm
```
npm install ffc-react-client-sdk
```

yarn
```
yarn add ffc-react-client-sdk
```

### Initializing the SDK
After you install the dependency, initialize the React SDK. You can do this in one of two ways:

- Using the asyncWithFfcProvider function
- Using the withFfcProvider function

Both rely on React's Context API which lets you access your flags from any level of your component hierarchy.

#### Initializing using asyncWithFfcProvider

The **asyncWithFfcProvider** function initializes the React SDK and returns a provider which is a React component. It is an async function. It accepts a **ProviderConfig** object.

**asyncWithFfcProvider** cannot be deferred. You must initialize **asyncWithFfcProvider** at the app entry point prior to rendering to ensure flags and the client are ready at the beginning of the app.

```javascript
import { asyncWithFfcProvider } from 'ffc-react-client-sdk';

(async () => {
  const config = {
    options: {
      secret: 'YOUR ENVIRONMENT SECRET',
      user: {
        userName: 'USER NAME',
        id: 'USER ID',
        customizedProperties: [
          {
            "name": "age",
            "value": '18'
          }
        ]
      }
    }
  }

  const FfcProvider = const FfcProvider = await asyncWithFfcProvider(config);
  render(
    <FfcProvider>
      <YourApp />
    </FfcProvider>,
    document.getElementById('reactDiv'),
  );
})();

```

After initialization is complete, your flags and the client become available at the start of your React app lifecycle. This ensures your app does not flicker due to flag changes at startup time.

> Rendering may be delayed  
Because the asyncWithFfcProvider function is asynchronous, the rendering of your React app is delayed until initialization is completed. This can take up to 100 milliseconds, but often completes sooner. Alternatively, you can use the withFfcProvider function if you prefer to render your app first and then process flag updates after rendering is complete.

> This function requires React 16.8.0 or later  
The asyncWithFfcProvider function uses the Hooks API, which requires React version 16.8.0 or later.

#### Initializing using withFfcProvider

The **withFfcProvider** function initializes the React SDK and wraps your root component in a **Context.Provider**. It accepts a **ProviderConfig** object used to configure the React SDK.

```javascript
import { withFfcProvider } from 'ffc-react-client-sdk';

const config = {
  options: {
    secret: 'YOUR ENVIRONMENT SECRET',
    user: {
      userName: 'USER NAME',
      id: 'USER ID',
      customizedProperties: [
        {
          "name": "age",
          "value": '18'
        }
      ]
    }
  }
};

export default withFfcProvider(config)(YourApp);
```

The React SDK automatically subscribes to flag change events. This is different from the JavaScript SDK, where customers need to opt in to event listening.

### Consuming the flags

#### Class component

There are two ways to consume the flags.

##### Using contextType property
```javascript
import { context } from 'ffc-react-client-sdk';

class MyComponent extends React.Component {
  static contextType = context;

  constructor(props) {
    super(props);
  }

  render() {
    const { flags } = this.context;

    return (
      <div>{ flags['dev-test-flag'] ? 'Flag on' : 'Flag off' }</div>
    )
  }
}

export default MyComponent;
```

#####  Using withFfcConsumer

The return value of withFfcConsumer is a wrapper function that takes your component and returns a React component injected with flags & ffcClient as props.

```javascript
import { withFfcConsumer } from 'ffc-react-client-sdk';

class MyComponent extends React.Component {
    render() {
      const { flags } = this.props;

      return (
        <div>
          <div>{flags.flag1}</div>
        </div>
      );
    }
  }

  export default withFfcConsumer()(Board)
```

#### Function component
There are two ways to consume the flags.

##### Using withFfcConsumer
The return value of withFfcConsumer is a wrapper function that takes your component and returns a React component injected with flags & ffcClient as props.

```javascript
import { withFfcConsumer } from 'ffc-react-client-sdk';

const Home = ({ flags, ffcClient /*, ...otherProps */ }) => {
  // You can call any of the methods from the JavaScript SDK
  // ffcClient.identify({...})

  return flags['dev-test-flag'] ? <div>Flag on</div> : <div>Flag off</div>;
};

export default withFfcConsumer()(Home);
```

##### Using Hooks
The React SDK offers two custom hooks which you can use as an alternative to **withFfcConsumer**: 
- useFlags
- useFfcClient.

> These functions require React 16.8.0 or later  
useFlags and useFfcClient use the Hooks API, which requires React version 16.8.0 or later.

useFlags is a custom hook which returns all feature flags. It uses the useContext primitive to access the feature-flags.co context set up by asyncWithFfcProvider or withFfcProvider. You still must use the asyncWithFfcProvider or the withFfcProvider higher-order component at the root of your application to initialize the React SDK and populate the context with FfcClient and your flags.

useFfcClient is the second custom hook which returns the underlying feature-flags.co's JavaScript SDK client object. Like the useFlags custom hook, useFfcClient also uses the useContext primitive to access the context set up by asyncWithFfcProvider or withFfcProvider. You still must use the asyncWithFfcProvider or the withFfcProvider higher-order component to initialize the React SDK to use this custom hook.

Here is an example of how to use those two hooks:

```javascript
import { useFlags, useFfcClient } from 'ffc-react-client-sdk';

const MyComponent = props => {
    const ffcClient = useFfcClient();

    const { flag1, flag2 } = useFlags();
    // or use
    const flags = useFlags();
    // then use flags.flag1 or flags['flag1'] to reference the flag1 feature flag
    
    return (
        <div>
            <div>1: {flag1}</div>
            <div>2: {flag2}</div>
        </div>
    );
};


export default MyComponent;

```

### Configuring the React SDK
The **ProviderConfig** object provides configuration to both **withFfcProvider** and **asyncWithFfcProvider** function.

The only mandatory property is the **options**, it is the config needed to initialize the ffc-js-client-side-sdk. To know more details about the **options**, please refer to [Initializing ffc-js-client-side-sdk](https://github.com/feature-flags-co/ffc-js-client-side-sdk#initializing-the-sdk). All other properties are React SDK related.

The complete liste of the available properties:

- **options**: the initialization config for ffc-js-client-side-sdk. **mandatory**

    You can use the **options.bootstrap** option to populate the SDK with default values. For more details, go to [ref](https://github.com/feature-flags-co/ffc-js-client-side-sdk#initializing-the-sdk)
- **reactOptions**: You can use this option to enable automatic camel casing of flag keys when using the React SDK. the default value is false  **not mandatory**
- **deferInitialization**: This property allows SDK initialization to be deferred until you define the ffcClient property. the default value is false **not mandatory**
  
    asyncWithFfcProvider does not support deferInitialization. You must initialize asyncWithFfcProvider at the app entry point prior to rendering to ensure flags and the client are ready at the beginning of your app.

    By deferring SDK initialization, you defer all steps which take place as part of SDK initialization, including reading flag values from local storage and sending the SDK's ready event.

    The one exception to this rule is that the SDK continues to load bootstrapped flag values as long as the bootstrapped values are provided as a map of flag keys and values. If you indicate that the SDK should bootstrap flags from local storage, this will not happen until the SDK initializes.

The following is an example ProviderConfig object including each of the above properties:
```javascript
{
  options: {
    secret: 'YOUR ENVIRONMENT SECRET',
    user: {
      userName: 'USER NAME',
      id: 'USER ID',
      customizedProperties: [
        {
          "name": "age",
          "value": '18'
        }
      ]
    }
    ...
  },
  reactOptions: {
    useCamelCaseFlagKeys: false
  },
  deferInitialization: false
}

```

## Flag keys
feature-flags.co primarily identifies feature flags by a key which must contain only alphanumeric characters, dots (.), underscores (_), and dashes (-). These keys are used across all of our APIs as well as in the SDKs to identify flags.

However, JavaScript and React cannot access keys with a dot notation, so the React SDK can change all flag keys to camel case (you need to activate this with the **reactOptions.useCamelCaseFlagKeys** parameter). A flag with key dev-flag-test is accessible as flags.devFlagTest. This notation **flags['dev-flag-test']** should be used if useCamelCaseFlagKeys is disabled, which is by default.

Be aware, by activating useCamelCaseFlagKeys, you would see following problems:

- It is possible to induce a key collision if there are multiple flag keys which resolve to the same camel-case key. For example, dev-flag-test and dev.flag.test are unique keys, but the React SDK changes them to the same camel-case key.
- If a flag key contains three or more capital letters in a row, the SDK automatically converts all letters between the first and last capital letter to lower case. For example, the SDK converts a flag with the key devQAFlagTest to devQaFlagTest. If you use devQAFlagTest with the useFlags() hook, the SDK does not find the flag.
- Our code [references tool](https://github.com/feature-flags-co/ffc-code-refs-core) expects your source code to reference the exact key, not a camel-case equivalent. The tool does not detect keys that were automatically changed to camel-case.
- Because the camel-case functionality is implemented in the React SDK instead of in the underlying JavaScript SDK, the underlying client object and functionality provided by the JavaScript SDK reflect flag keys in their original format. Only React-specific contexts such as your injected props use camel case.

## Importing types

In addition to its own bundled types, the React SDK uses types from ffc-js-client-side-sdk. If you use Typescript and you need to use ffc-js-client-side-sdk types, you can install the ffc-js-client-side-sdk package as a dev dependency. You can then import the types you want directly from ffc-js-client-side-sdk.

If you use eslint, the SDK requires that you add ffc-js-client-side-sdk as a dev dependency. Otherwise, eslint will report a no-extraneous-dependencies error.


