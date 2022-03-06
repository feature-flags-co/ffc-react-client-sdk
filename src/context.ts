import ffcClient from 'ffc-js-client-side-sdk';
import { createContext } from 'react';
import { FfcContext } from './types';

const context = createContext<FfcContext>({ flags: {}, ffcClient});

const {
  Provider,
  Consumer,
} = context;

export { Provider, Consumer, FfcContext };
export default context;