import * as firebase from 'firebase'

let HAS_INITIALIZED = false

const initFirebase = () => {
    if (!HAS_INITIALIZED) {
        const config = {
          apiKey: "AIzaSyCdf_99OpPdugQPtnK6wh08P9QDlamdnG8",
          authDomain: "daily-travel-6ff5f.firebaseapp.com",
          databaseURL: "https://daily-travel-6ff5f.firebaseio.com",
          projectId: "daily-travel-6ff5f",
          storageBucket: "daily-travel-6ff5f.appspot.com",
          messagingSenderId: "651940849732"
        }

        firebase.database.enableLogging(true)
        firebase.initializeApp(config)
        HAS_INITIALIZED = true
    }
}

export const getAuth = () => {
    initFirebase()
    return firebase.auth()
}

export const getDatabase = () => {
    initFirebase()
    return firebase.database()
}

export const getStorage = () => {
    initFirebase()
    return firebase.storage()
}
