import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  child,
  set,
  onValue,
  remove,
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

function validateEmail(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
}

var otp;
function createOTP() {
  var otp = Math.floor(10000 + Math.random() * 90000);
  return otp;
}

let myInterval;
function myTimer(dem) {
  if (dem <= 60) {
    document.getElementById("sendOTP").style.pointerEvents = "none";
    document.getElementById("sendOTP").textContent =
      `Gửi lại OTP (${60 - dem}s)`;
  } else if (dem > 60) {
    document.getElementById("sendOTP").style.pointerEvents = "auto";
    document.getElementById("sendOTP").textContent = `Gửi mã OTP`;
    clearTimer();
  }
  console.log(dem);
}
function clearTimer() {
  clearInterval(myInterval);
}

document.getElementById("sendOTP").addEventListener("click", function () {
  var user = document.getElementById("user").value;
  var email = document.getElementById("email").value;
  var emailError = document.getElementById("error-email");
  let dem = 0;
  if (!email) {
    alert("Vui lòng nhập email trước khi gửi OTP");
    return;
  } else {
    if (!validateEmail(email)) {
      emailError.style.display = "block";
      emailError.textContent = "* Email không hợp lệ";
      return;
    } else {
      myInterval = setInterval(() => myTimer(dem++), 1000);
      otp = createOTP();
      console.log("Generated OTP:", otp);
    }
  }
  let params = {
    name: user,
    otp: otp,
    email: email,
  };
  emailjs
    .send("service_druka5w", "template_0pekckt", params)
    .then(function (response) {
      if (response.status === 200) {
        alert("OTP đã được gửi đến email của bạn!");
      } else {
        alert("Gửi OTP thất bại. Vui lòng thử lại.");
      }
    });
});

function validatepone(number) {
  return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(number);
}

document.getElementById("submit").addEventListener("click", function () {
  var username = document.getElementById("user").value;
  var password = document.getElementById("pass").value;
  var confirmPassword = document.getElementById("password").value;
  var email = document.getElementById("email").value;
  var phone = document.getElementById("phone").value;
  var userOtp = document.getElementById("OTP").value;

  var usernameError = document.getElementById("error-user");
  var passwordError = document.getElementById("error-password");
  var confirmPasswordError = document.getElementById("error-confirm-password");
  var emailError = document.getElementById("error-email");
  var phoneError = document.getElementById("error-phone");
  var otpError = document.getElementById("error-otp");
  if (!username) {
    usernameError.style.display = "block";
  } else {
    usernameError.style.display = "none";
    get(ref(db, `users/${username}`)).then((snapshot) => {
      if (snapshot.exists()) {
        usernameError.textContent = "* Tài khoản đã tồn tại";
        usernameError.style.display = "block";
      }
    });
  }
  if (!password) {
    passwordError.style.display = "block";
  } else {
    passwordError.style.display = "none";
  }
  if (!confirmPassword) {
    confirmPasswordError.style.display = "block";
  } else {
    confirmPasswordError.style.display = "none";
  }
  if (!email) {
    emailError.style.display = "block";
    emailError.textContent = "* Vui lòng nhập email";
  } else {
    emailError.style.display = "none";
    if (!validateEmail(email)) {
      emailError.textContent = "* Email không hợp lệ";
      emailError.style.display = "block";
    }
  }
  if (!phone) {
    phoneError.style.display = "block";
    phoneError.textContent = "* Vui lòng nhập số điện thoại";
  } else {
    console.log(validatepone(phone));
    if (!validatepone(phone)) {
      phoneError.textContent = "* Số điện thoại không hợp lệ";
      phoneError.style.display = "block";
      return;
    } else {
      phoneError.style.display = "none";
    }
  }
  if (password !== confirmPassword) {
    document.getElementById("password").value = "";
    confirmPasswordError.textContent = "* Mật khẩu xác nhận không khớp";
    confirmPasswordError.style.display = "block";
    return;
  }
  if (!userOtp) {
    otpError.style.display = "block";
    otpError.textContent = "* Vui lòng nhập mã OTP";
    return;
  }
  if (userOtp != otp) {
    document.getElementById("OTP").value = "";
    otpError.textContent = "* Mã OTP không đúng";
    otpError.style.display = "block";
    return;
  } else {
    if (
      user &&
      password &&
      confirmPassword &&
      email &&
      phone &&
      validateEmail(email) &&
      password === confirmPassword
    ) {
      let params = {
        CompanyName: "Nuke DashBoard",
        name: username,
        otp: otp,
        email: email,
      };
      emailjs.send("service_druka5w", "template_q8cy9j8", params).then(
        function (response) {
          console.log("SUCCESS!", response.status, response.text);
          alert("Đăng ký thành công!");
          set(ref(db, `users/${username}`), {
            email: email,
            phone: phone,
            password: password,
          }).then(() => {
            window.location.href = "index.html";
          });
        },
        function (error) {
          console.log("FAILED...", error);
        },
      );
    }
  }
});
