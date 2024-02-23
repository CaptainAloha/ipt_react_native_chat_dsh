import {initializeApp} from "firebase/app";
import {initializeFirestore} from "@firebase/firestore";

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};
// initialize firebase
let firebaseApp = initializeApp(firebaseConfig);
//export const auth = getAuth(firebaseApp);
export const database = initializeFirestore(firebaseApp, {experimentalForceLongPolling: true});
