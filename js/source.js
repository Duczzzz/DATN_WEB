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
const hdsdDHT11 =
  "https://raw.githubusercontent.com/Duczzzz/DATN_WEB/main/baigiang/Bai2.pdf";
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

const tabs = [
  "bme280",
  "dht11",
  "control",
  "button",
  "userbuild",
  "timecontrol",
];
const panels = [
  "BME280",
  "DHT11",
  "CONTROL",
  "BUTTON",
  "USERBUILD",
  "TIMECONTROL",
];

const NEON_COLORS = {
  bme280: "#00fff7",
  dht11: "#ff00ff",
  control: "#00ff88",
  button: "#ff6600",
  userbuild: "#bf00ff",
  timecontrol: "#ffee00",
};

function switchTab(activeTab) {
  tabs.forEach((tab) => {
    const isActive = tab === activeTab;
    const panelId = panels[tabs.indexOf(tab)];

    document.getElementById(panelId).style.display = isActive
      ? "block"
      : "none";

    const btn = document.getElementById(tab);
    if (isActive) {
      btn.style.background = NEON_COLORS[tab];
      btn.style.color = "#000";
      btn.style.boxShadow = `0 0 10px ${NEON_COLORS[tab]}, 0 0 20px ${NEON_COLORS[tab]}`;
    } else {
      btn.style.background = "transparent";
      btn.style.color = "#ccc";
      btn.style.boxShadow = "none";
    }
  });
}

tabs.forEach((tab) => {
  document.getElementById(tab).onclick = () => switchTab(tab);
});

switchTab("bme280");
document.addEventListener("click", (e) => {
  const btn = e.target.id;
  const parts = btn.split("-");
  if (parts[0] != "copy") return;
  if (btn == "copy-btnBME280") {
    navigator.clipboard.writeText(sourceBME);
  } else if (btn == "copy-btnDHT11") {
    navigator.clipboard.writeText(sourceDHT11);
  } else if (btn == "copy-btnCONTROL") {
    navigator.clipboard.writeText(sourcecontrol);
  } else if (btn == "copy-btnTIMECONTROL") {
    navigator.clipboard.writeText(sourcetimecontrol);
  } else if (btn == "copy-btnUSERBUILD") {
    navigator.clipboard.writeText(sourceuserbuild);
  } else if (btn == "copy-btnBUTTON") {
    navigator.clipboard.writeText(sourcebtn);
  }
  document.getElementById(btn).innerHTML =
    `<i class="fa-solid fa-check"></i> Đã sao chép`;
  setTimeout(() => {
    document.getElementById().innerHTML = `<i class="fa-solid fa-copy"></i> Sao chép code`;
  }, 2000);
});
document.addEventListener("click", (e) => {
  const btn = e.target.id;
  const parts = btn.split("-");
  if (parts[0] != "download") return;
  if (btn == "download-btnBME280") {
    download(hdsdBME280);
  } else if (btn == "download-btnDHT11") {
    download(hdsdDHT11);
  } else if (btn == "download-btnBUTTON") {
    alert("tính năng đang phát triển");
    return;
  } else if (btn == "download-btnCONTROL") {
    alert("tính năng đang phát triển");
    return;
  } else if (btn == "download-btnTIMECONTROL") {
    alert("tính năng đang phát triển");
    return;
  } else if (btn == "download-btnUSERBUILD") {
    alert("tính năng đang phát triển");
    return;
  }

  document.getElementById(btn).innerHTML =
    `<i class="fa-solid fa-check"></i> Đã tải xuống`;
  setTimeout(() => {
    document.getElementById("btn").innerHTML =
      `<i class="fa-solid fa-download"></i> Tải xuống bài giảng hướng dẫn`;
  }, 1000);
});
