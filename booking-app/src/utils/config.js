let apiKey = process.env.REACT_APP_FIREBASE_API_KEY
let authDomain = process.env.REACT_APP_FIREBASE_AUTH_DOMAIN
let databaseURL = process.env.REACT_APP_FIREBASE_DATABASE_URL
let projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID
let storageBucket = process.env.REACT_APP_FIREBASE_STORAGE_BUCKET
let messagingSenderId = process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
let appId = process.env.REACT_APP_FIREBASE_APP_ID
let measurementId = process.env.REACT_APP_FIREBASE_MEASUREMENT_ID

module.exports = {
    apiKey,
    authDomain,
    databaseURL,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId
}