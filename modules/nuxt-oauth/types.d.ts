import {
    GsiButtonConfiguration,
    CodeClientConfig,
    IdConfiguration,
  } from "./types";
  
  declare global {
    interface Window {
      google?: {
        accounts: {
          id: {
            initialize: (input: IdConfiguration) => void;
            renderButton: (
              parent: HTMLElement,
              options: GsiButtonConfiguration
            ) => void;
            disableAutoSelect: () => void;
            storeCredential: (
              credential: { id: string; password: string },
              callback?: () => void
            ) => void;
            cancel: () => void;
            onGoogleLibraryLoad: Function;
            revoke: (accessToken: string, done: () => void) => void;
          };
          oauth2: {
            initCodeClient: (config: CodeClientConfig) => {
              requestCode: () => void;
            };
            revoke: (accessToken: string, done?: () => void) => void;
          };
        };
      };
    }
  }
  