const user = localStorage.getItem("username");
const bme280 =
  "https://raw.githubusercontent.com/Duczzzz/DATN_WEB/main/Source_testBoard/BME280_test/BME280_test.ino";
const dht11 =
  "https://raw.githubusercontent.com/Duczzzz/DATN_WEB/main/Source_testBoard/Dht11_test/Dht11_test.ino";
const btn1 =
  "https://raw.githubusercontent.com/Duczzzz/DATN_WEB/main/Source_testBoard/Test_button/Test_button.ino";
const control =
  "https://raw.githubusercontent.com/Duczzzz/DATN_WEB/refs/heads/main/Source_testBoard/control_test/control_test.ino";
async function downbox(link) {
  const hdsdRaw = await fetch(link).then((r) => r.text());
  return hdsdRaw.replaceAll("{user}", user);
}

const sourceBME = await downbox(bme280);
const sourceDHT11 = await downbox(dht11);
const sourcebtn = await downbox(btn1);
const sourcecontrol = await downbox(control);

function load(source, title, Count) {
  let h1 = document.createElement("h1");
  h1.className = "heading";
  h1.innerText = `Source Code ${title}`;

  let box = document.createElement("div");
  box.className = "box box" + Count;
  box.id = title;

  let pre = document.createElement("pre");
  pre.innerText = source;

  box.appendChild(h1);
  box.appendChild(pre);

  document.querySelector(".container").append(box);
}

load(sourceBME, "BME280", 1);
load(sourceDHT11, "DHT11", 2);
load(sourcebtn, "BUTTON", 3);
load(sourcecontrol, "CONTROL", 4);

document.getElementById("BME280").style.display = "block";
document.getElementById("DHT11").style.display = "none";
document.getElementById("BUTTON").style.display = "none";
document.getElementById("CONTROL").style.display = "none";
document.getElementById("bme280").style.background = "red";

document.getElementById("bme280").onclick = function () {
  document.getElementById("BME280").style.display = "block";
  document.getElementById("DHT11").style.display = "none";
  document.getElementById("BUTTON").style.display = "none";
  document.getElementById("CONTROL").style.display = "none";
  document.getElementById("bme280").style.background = "red";
  document.getElementById("control").style.background = "white";
  document.getElementById("button").style.background = "white";
  document.getElementById("dht11").style.background = "white";
};
document.getElementById("dht11").onclick = function () {
  document.getElementById("BME280").style.display = "none";
  document.getElementById("DHT11").style.display = "block";
  document.getElementById("BUTTON").style.display = "none";
  document.getElementById("CONTROL").style.display = "none";
  document.getElementById("dht11").style.background = "red";
  document.getElementById("bme280").style.background = "white";
  document.getElementById("control").style.background = "white";
  document.getElementById("button").style.background = "white";
};
document.getElementById("control").onclick = function () {
  document.getElementById("BME280").style.display = "none";
  document.getElementById("DHT11").style.display = "none";
  document.getElementById("BUTTON").style.display = "none";
  document.getElementById("CONTROL").style.display = "block";
  document.getElementById("dht11").style.background = "white";
  document.getElementById("bme280").style.background = "white";
  document.getElementById("control").style.background = "red";
  document.getElementById("button").style.background = "white";
};
document.getElementById("button").onclick = function () {
  document.getElementById("BME280").style.display = "none";
  document.getElementById("DHT11").style.display = "none";
  document.getElementById("BUTTON").style.display = "block";
  document.getElementById("CONTROL").style.display = "none";
  document.getElementById("dht11").style.background = "white";
  document.getElementById("bme280").style.background = "white";
  document.getElementById("control").style.background = "white";
  document.getElementById("button").style.background = "red";
};
