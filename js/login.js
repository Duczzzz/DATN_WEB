import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  child,
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

$(document).ready(function () {
  $(".eye").on("click", function () {
    $(this).toggleClass("open");
    $(this).children("i").toggleClass("fa-eye fa-eye-slash");

    const input = $(this).prev(".form-input");
    input.attr("type", input.attr("type") === "password" ? "text" : "password");
  });
});

document.getElementById("submit").onclick = function () {
  const username = document.getElementById("user").value.trim();
  const password = document.getElementById("pass").value.trim();

  if (!username || !password) {
    alert("Vui lòng nhập đủ thông tin");
    return;
  }

  const dbRef = ref(db);

  get(child(dbRef, `users/${username}`))
    .then((snapshot) => {
      if (!snapshot.exists()) {
        alert("Tài khoản không tồn tại");
        return;
      }
      if (snapshot.val().password === password) {
        alert("Đăng nhập thành công");
        window.location.href = "home.html";
      } else {
        alert("Sai mật khẩu");
      }
    })
    .catch((err) => {
      console.error(err);
      alert("Lỗi Firebase");
    });
};
