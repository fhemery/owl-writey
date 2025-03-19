import { ApplicationEnvironment } from '@owl/front/infra';

// Copy-paste this to your environment.ts file and setup your own values
// from the firebase console: https://console.firebase.google.com
export const environment: ApplicationEnvironment = {
  firebase: {
    apiKey: '<TODO>',
    authDomain: '<TODO>',
    projectId: '<TODO>',
    storageBucket: '<TODO>',
    messagingSenderId: '<TODO>',
    appId: '<TODO>',
  },
};
