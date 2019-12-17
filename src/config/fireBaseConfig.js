import firebase from "firebase";
let config = {
  apiKey: "AIzaSyC1QTFirlrDS1u0H4yYJmDxFZ9k_j1bxu0",
  authDomain: "warehouse-c87bf.firebaseapp.com",
  databaseURL: "https://warehouse-c87bf.firebaseio.com",
  projectId: "warehouse-c87bf",
  storageBucket: "warehouse-c87bf.appspot.com",
  messagingSenderId: "943003809138",
  appId: "1:943003809138:web:cd75100b73ac447f7659eb",
  measurementId: "G-1WVJ4TM2KV"
};
let appConfig = firebase.initializeApp(config);
export const db = appConfig.database();
