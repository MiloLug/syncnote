# Syncnote

Simple note-list app with `Ionic Framework`.

It implements basic functionality for the notes as tags, text formatting.
Notes can be sorted by creation time and title. Also they can be filtered by tags and title parts.

The main idea is to have optimized continuous syncronization between the local and remote storage. Its algorithm determines what needs to be synced and what doesn't, from the both sides (local and remote).


## To run/build:

### Dependencies
 - Node.js >= 14.5 (`nvmrc` file presented)
 - Ionic CLI (`npm install -g @ionic/cli`)
 - Android Strudio, for Android build

### Building
```bash
nvm use .
npm i
```

 - To build the web app: `ionic build`
 - To run the dev server: `ionic serve`
 - Build for Android: `ionic capacitor build android`
 - Build for iOS: `ionic capacitor build ios`