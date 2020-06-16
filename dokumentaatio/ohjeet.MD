# Ohjeet jatkokehitystä varten

Projekti alustettiin Create React App - komennolla.
Tyylittely Material Uin avulla pääasiassa.
Backend, database sekä hostaus pyörii Firebasessa.

Käytössä olevat scriptit
### `npm start`
Käynnistää devausmoden.
http://localhost:3000 .

### `npm run build`
Buildaa projektin build kansioon.

### `firebase deploy`
Jos firebase on konfiguroitu, deployaa se buildin ja asetukset webbiin.

Firebaselle on myös asetettu 'Cloud Functions' osioon muuttujat sähköpostille, jotta sähköpostien automaattinen lähetys onnistuu.

Jotta sovellusta voi jatkokehittää, täytyy sovelluksen locaaliin juureen asettaa .env.local ja täyttää siihen Firebasen tarvitsemaa konfiguraatiota.
Tällä hetkellä käytössä on:
* REACT_APP_FIREBASE_API_KEY=
* REACT_APP_FIREBASE_AUTH_DOMAIN=
* REACT_APP_FIREBASE_DATABASE_URL=
* REACT_APP_FIREBASE_PROJECT_ID=
* REACT_APP_FIREBASE_STORAGE_BUCKET=
* REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
* REACT_APP_FIREBASE_APP_ID=
* REACT_APP_FIREBASE_MEASUREMENT_ID=
