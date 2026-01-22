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
onValue(ref(db, "bme280/Temp"), (snapshot) => {
  document.getElementById("nhietdoBME280").innerText = snapshot.val() + " °C";
});
onValue(ref(db, "bme280/Humi"), (snapshot) => {
  document.getElementById("doamBME280").innerText = snapshot.val() + " %";
});
onValue(ref(db, "Out/Out1"), (snapshot) => {
  var status1 = document.getElementById("status1");
  if (snapshot.val() == 1) {
    status1.innerText = "OUT 1 Đang bật";
  } else {
    status1.innerText = "OUT 1 Đang tắt";
  }
});
onValue(ref(db, "Out/Out2"), (snapshot) => {
  var status2 = document.getElementById("status2");
  if (snapshot.val() == 1) {
    status2.innerText = "OUT 2 Đang bật";
  } else {
    status2.innerText = "OUT 2 Đang tắt";
  }
});
document.getElementById("btn-inout1").onclick = function () {
  const btn = document.getElementById("btn-inout1");
  if (btn.style.backgroundColor == "rgb(255, 152, 152)") {
    set(ref(db, "In/In1"), 1);
    btn.style.backgroundColor = "rgb(41, 63, 255)";
  } else {
    set(ref(db, "In/In1"), 0);
    btn.style.backgroundColor = "rgb(255, 152, 152)";
  }
};
document.getElementById("btn-inout2").onclick = function () {
  const btn = document.getElementById("btn-inout2");
  if (btn.style.backgroundColor == "rgb(255, 152, 152)") {
    set(ref(db, "In/In2"), 1);
    btn.style.backgroundColor = "rgb(41, 63, 255)";
  } else {
    set(ref(db, "In/In2"), 0);
    btn.style.backgroundColor = "rgb(255, 152, 152)";
  }
};
