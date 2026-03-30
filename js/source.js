const user = localStorage.getItem("username");
const bme280 =
  "https://raw.githubusercontent.com/Duczzzz/DATN_WEB/main/Source_testBoard/BME280_test/BME280_test.ino";
const dht11 =
  "https://raw.githubusercontent.com/Duczzzz/DATN_WEB/main/Source_testBoard/Dht11_test/Dht11_test.ino";
const btn1 =
  "https://raw.githubusercontent.com/Duczzzz/DATN_WEB/main/Source_testBoard/Test_button/Test_button.ino";
const control =
  "https://raw.githubusercontent.com/Duczzzz/DATN_WEB/refs/heads/main/Source_testBoard/control_test/control_test.ino";
const timecontrol =
  "https://raw.githubusercontent.com/Duczzzz/DATN_WEB/refs/heads/main/Source_testBoard/time_control_ssd1306/time_control_ssd1306.ino";
const userbuild =
  "https://raw.githubusercontent.com/Duczzzz/DATN_WEB/refs/heads/main/Source_testBoard/Userbuild/Userbuild.ino";
const hdsdBME280 =
  "https://raw.githubusercontent.com/Duczzzz/DATN_WEB/main/baigiang/Bai1.pdf";
async function downbox(link) {
  const hdsdRaw = await fetch(link).then((r) => r.text());
  return hdsdRaw.replaceAll("{user}", user);
}
function download(link) {
  const a = document.createElement("a");
  a.setAttribute("href", link);
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
// async function download(link, filename) {
//   const http = require("https");
//   const fs = require("fs");
//   const file = fs.createWriteStream(filename);
//   http.get(link, function (response) {
//     response.pipe(file);
//   });
//   alert("Đang tải xuống, vui lòng chờ...");
// }
const sourceBME = await downbox(bme280);
const sourceDHT11 = await downbox(dht11);
const sourcebtn = await downbox(btn1);
const sourcecontrol = await downbox(control);
const sourcetimecontrol = await downbox(timecontrol);
const sourceuserbuild = await downbox(userbuild);
function load(source, title, Count) {
  let h1 = document.createElement("h1");
  h1.className = "heading";
  h1.innerText = `Mã nguồn ${title} `;

  let btncp = document.createElement("button");
  btncp.className = "copy-btn";
  btncp.id = "copy-btn" + title;
  btncp.innerHTML = `<i class="fa-solid fa-copy"></i> Sao chép code`;

  let btndl = document.createElement("button");
  btndl.className = "download-btn";
  btndl.innerHTML = `<i class="fa-solid fa-download"></i> Tải xuống bài giảng hướng dẫn`;
  btndl.id = "download-btn" + title;

  let box = document.createElement("div");
  box.className = "box box" + Count;
  box.id = title;

  let pre = document.createElement("pre");
  pre.innerText = source;

  box.appendChild(h1);
  box.appendChild(btncp);
  box.appendChild(btndl);
  box.appendChild(pre);

  document.querySelector(".container").append(box);
}

load(sourceBME, "BME280", 1);
load(sourceDHT11, "DHT11", 2);
load(sourcebtn, "BUTTON", 3);
load(sourcecontrol, "CONTROL", 4);
load(sourcetimecontrol, "TIMECONTROL", 5);
load(sourceuserbuild, "USERBUILD", 6);

document.getElementById("BME280").style.display = "block";
document.getElementById("DHT11").style.display = "none";
document.getElementById("BUTTON").style.display = "none";
document.getElementById("CONTROL").style.display = "none";
document.getElementById("TIMECONTROL").style.display = "none";
document.getElementById("USERBUILD").style.display = "none";
document.getElementById("bme280").style.background = "red";

document.getElementById("bme280").onclick = function () {
  document.getElementById("BME280").style.display = "block";
  document.getElementById("DHT11").style.display = "none";
  document.getElementById("BUTTON").style.display = "none";
  document.getElementById("CONTROL").style.display = "none";
  document.getElementById("TIMECONTROL").style.display = "none";
  document.getElementById("USERBUILD").style.display = "none";

  document.getElementById("bme280").style.background = "red";
  document.getElementById("control").style.background = "white";
  document.getElementById("button").style.background = "white";
  document.getElementById("dht11").style.background = "white";
  document.getElementById("timecontrol").style.background = "white";
  document.getElementById("userbuild").style.background = "white";
};
document.getElementById("dht11").onclick = function () {
  document.getElementById("BME280").style.display = "none";
  document.getElementById("DHT11").style.display = "block";
  document.getElementById("BUTTON").style.display = "none";
  document.getElementById("CONTROL").style.display = "none";
  document.getElementById("TIMECONTROL").style.display = "none";
  document.getElementById("USERBUILD").style.display = "none";

  document.getElementById("dht11").style.background = "red";
  document.getElementById("bme280").style.background = "white";
  document.getElementById("control").style.background = "white";
  document.getElementById("button").style.background = "white";
  document.getElementById("timecontrol").style.background = "white";
  document.getElementById("userbuild").style.background = "white";
};
document.getElementById("control").onclick = function () {
  document.getElementById("BME280").style.display = "none";
  document.getElementById("DHT11").style.display = "none";
  document.getElementById("BUTTON").style.display = "none";
  document.getElementById("CONTROL").style.display = "block";
  document.getElementById("TIMECONTROL").style.display = "none";
  document.getElementById("USERBUILD").style.display = "none";

  document.getElementById("dht11").style.background = "white";
  document.getElementById("bme280").style.background = "white";
  document.getElementById("control").style.background = "red";
  document.getElementById("button").style.background = "white";
  document.getElementById("timecontrol").style.background = "white";
  document.getElementById("userbuild").style.background = "white";
};
document.getElementById("button").onclick = function () {
  document.getElementById("BME280").style.display = "none";
  document.getElementById("DHT11").style.display = "none";
  document.getElementById("BUTTON").style.display = "block";
  document.getElementById("CONTROL").style.display = "none";
  document.getElementById("TIMECONTROL").style.display = "none";
  document.getElementById("USERBUILD").style.display = "none";

  document.getElementById("dht11").style.background = "white";
  document.getElementById("bme280").style.background = "white";
  document.getElementById("control").style.background = "white";
  document.getElementById("timecontrol").style.background = "white";
  document.getElementById("userbuild").style.background = "white";
  document.getElementById("button").style.background = "red";
};
document.getElementById("userbuild").onclick = function () {
  document.getElementById("BME280").style.display = "none";
  document.getElementById("DHT11").style.display = "none";
  document.getElementById("BUTTON").style.display = "none";
  document.getElementById("CONTROL").style.display = "none";
  document.getElementById("TIMECONTROL").style.display = "none";
  document.getElementById("USERBUILD").style.display = "block";

  document.getElementById("dht11").style.background = "white";
  document.getElementById("bme280").style.background = "white";
  document.getElementById("control").style.background = "white";
  document.getElementById("button").style.background = "white";
  document.getElementById("timecontrol").style.background = "white";
  document.getElementById("userbuild").style.background = "red";
};
document.getElementById("timecontrol").onclick = function () {
  document.getElementById("BME280").style.display = "none";
  document.getElementById("DHT11").style.display = "none";
  document.getElementById("BUTTON").style.display = "none";
  document.getElementById("CONTROL").style.display = "none";
  document.getElementById("USERBUILD").style.display = "none";
  document.getElementById("TIMECONTROL").style.display = "block";

  document.getElementById("dht11").style.background = "white";
  document.getElementById("bme280").style.background = "white";
  document.getElementById("control").style.background = "white";
  document.getElementById("button").style.background = "white";
  document.getElementById("userbuild").style.background = "white";
  document.getElementById("timecontrol").style.background = "red";
};
document.getElementById("copy-btnBME280").onclick = function () {
  navigator.clipboard.writeText(sourceBME);
  document.getElementById("copy-btnBME280").innerHTML =
    `<i class="fa-solid fa-check"></i> Đã sao chép`;
  setTimeout(() => {
    document.getElementById("copy-btnBME280").innerHTML =
      `<i class="fa-solid fa-copy"></i> Sao chép code`;
  }, 2000);
};
document.getElementById("copy-btnDHT11").onclick = function () {
  navigator.clipboard.writeText(sourceDHT11);
  document.getElementById("copy-btnDHT11").innerHTML =
    `<i class="fa-solid fa-check"></i> Đã sao chép`;
  setTimeout(() => {
    document.getElementById("copy-btnDHT11").innerHTML =
      `<i class="fa-solid fa-copy"></i> Sao chép code`;
  }, 2000);
};
document.getElementById("copy-btnBUTTON").onclick = function () {
  navigator.clipboard.writeText(sourcebtn);
  document.getElementById("copy-btnBUTTON").innerHTML =
    `<i class="fa-solid fa-check"></i> Đã sao chép`;
  setTimeout(() => {
    document.getElementById("copy-btnBUTTON").innerHTML =
      `<i class="fa-solid fa-copy"></i> Sao chép code`;
  }, 2000);
};
document.getElementById("copy-btnCONTROL").onclick = function () {
  navigator.clipboard.writeText(sourcecontrol);
  document.getElementById("copy-btnCONTROL").innerHTML =
    `<i class="fa-solid fa-check"></i> Đã sao chép`;
  setTimeout(() => {
    document.getElementById("copy-btnCONTROL").innerHTML =
      `<i class="fa-solid fa-copy"></i> Sao chép code`;
  }, 2000);
};
document.getElementById("copy-btnTIMECONTROL").onclick = function () {
  navigator.clipboard.writeText(sourcetimecontrol);
  document.getElementById("copy-btnTIMECONTROL").innerHTML =
    `<i class="fa-solid fa-check"></i> Đã sao chép`;
  setTimeout(() => {
    document.getElementById("copy-btnTIMECONTROL").innerHTML =
      `<i class="fa-solid fa-copy"></i> Sao chép code`;
  }, 2000);
};

document.getElementById("download-btnBME280").onclick = async function () {
  download(hdsdBME280);
  document.getElementById("download-btnBME280").innerHTML =
    `<i class="fa-solid fa-check"></i> Đã tải xuống`;
  setTimeout(() => {
    document.getElementById("download-btnBME280").innerHTML =
      `<i class="fa-solid fa-download"></i> Tải xuống bài giảng hướng dẫn`;
  }, 1000);
};
document.getElementById("download-btnDHT11").onclick = async function () {
  alert("Chức năng đang được cập nhật, vui lòng quay lại sau!");
};
document.getElementById("download-btnBUTTON").onclick = async function () {
  alert("Chức năng đang được cập nhật, vui lòng quay lại sau!");
};
document.getElementById("download-btnCONTROL").onclick = async function () {
  alert("Chức năng đang được cập nhật, vui lòng quay lại sau!");
};
document.getElementById("download-btnTIMECONTROL").onclick = async function () {
  alert("Chức năng đang được cập nhật, vui lòng quay lại sau!");
};
