import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  child,
  set,
  onValue,
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";
const firebaseConfig = {
  apiKey: "AIzaSyBliSd_F2NAl02D4FzMdtY0szkhpHdMf8c",
  authDomain: "doantn-885dc.firebaseapp.com",
  databaseURL: "https://doantn-885dc-default-rtdb.firebaseio.com",
  projectId: "doantn-885dc",
  storageBucket: "doantn-885dc.firebasestorage.app",
  messagingSenderId: "599011961788",
  appId: "1:599011961788:web:008c324dbfc6b3cf6699b9",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
onValue(ref(db, "dht11/Temp"), (snapshot) => {
  document.getElementById("nhietdo").innerText = snapshot.val() + " °C";
});
onValue(ref(db, "dht11/Humi"), (snapshot) => {
  document.getElementById("doam").innerText = snapshot.val() + " %";
});
let a = -1;
window.getvalueDHT11 = function () {
  a = a + 1;
  if (a > 5) a = -1;
  set(ref(db, "mode"), a);
};
