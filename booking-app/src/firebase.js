import * as firebase from 'firebase/app';

import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/performance';

const fbconfig = require('./utils/config')

const config = {
    apiKey: fbconfig.apiKey,
    authDomain: fbconfig.authDomain,
    databaseURL: fbconfig.databaseURL,
    projectId: fbconfig.projectId,
    storageBucket: fbconfig.storageBucket,
    messagingSenderId: fbconfig.messagingSenderId,
    appId: fbconfig.appId,
    measurementId: fbconfig.measurementId
  }
firebase.initializeApp(config);




export default firebase;
export const analytics = firebase.analytics();
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const performance = firebase.performance();