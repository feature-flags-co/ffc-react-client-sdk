/// <reference types="react" />
import { FfcContext } from './types';
declare const context: import("react").Context<FfcContext>;
declare const Provider: import("react").Provider<FfcContext>, Consumer: import("react").Consumer<FfcContext>;
export { Provider, Consumer, FfcContext };
export default context;
