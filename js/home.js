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
const ctx1 = document.getElementById("ChartDHT11");
const mixedChart = new Chart(ctx1, {
  data: {
    datasets: [
      {
        type: "bar",
        label: "Nhiệt độ",
        data: [],
      },
      {
        type: "line",
        label: "Độ ẩm",
        data: [],
      },
    ],
    labels: [],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
      y: {
        min: 0,
        max: 100,
      },
    },
    plugins: {
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "x",
        },
        pan: {
          enabled: true,
          mode: "x",
        },
      },
    },
  },
});
const ctx2 = document.getElementById("ChartBME280");
const mixedChart2 = new Chart(ctx2, {
  data: {
    datasets: [
      {
        type: "bar",
        label: "Nhiệt độ",
        data: [],
      },
      {
        type: "line",
        label: "Độ ẩm",
        data: [],
      },
    ],
    labels: [],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
      y: {
        min: 0,
        max: 100,
      },
    },
    plugins: {
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "x",
        },
        pan: {
          enabled: true,
          mode: "x",
        },
      },
    },
  },
});
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
onValue(ref(db, "dht11"), (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  const temp = data.Temp;
  const humi = data.Humi;
  const time = new Date().toLocaleTimeString();

  document.getElementById("nhietdo").innerText = temp + " °C";
  document.getElementById("doam").innerText = humi + " %";

  mixedChart.data.labels.push(time);
  mixedChart.data.datasets[0].data.push(temp);
  mixedChart.data.datasets[1].data.push(humi);
  if (live2) {
    mixedChart.resetZoom();
  }
  mixedChart.update();
});
onValue(ref(db, "bme280"), (snapshot) => {
  const data = snapshot.val();
  if (!data) return;
  const temp = data.Temp;
  const humi = data.Humi;
  const time = new Date().toLocaleTimeString();
  document.getElementById("nhietdoBME280").innerText = temp + " °C";
  document.getElementById("doamBME280").innerText = humi + " %";
  mixedChart2.data.labels.push(time);
  mixedChart2.data.datasets[0].data.push(temp);
  mixedChart2.data.datasets[1].data.push(humi);
  if (live1) {
    mixedChart2.resetZoom();
  }
  mixedChart2.update();
});
onValue(ref(db, "Out"), (snapshot) => {
  const data = snapshot.val();
  if (!data) return;
  const status1 = data.Out1;
  const status2 = data.Out2;
  if (status1 == 1) {
    document.getElementById("status1").innerText = "OUT 1 Đang bật";
  } else {
    document.getElementById("status1").innerText = "OUT 1 Đang tắt";
  }
  if (status2 == 1) {
    document.getElementById("status2").innerText = "OUT 2 Đang bật";
  } else {
    document.getElementById("status2").innerText = "OUT 2 Đang tắt";
  }
});
onValue(ref(db, "bme280/ledbme"), (snapshot) => {
  if (snapshot.val() == 1) {
    document.getElementById("warnLedBME280").innerText = "Đang bật";
  } else document.getElementById("warnLedBME280").innerText = "Đang tắt";
});
onValue(ref(db, "dht11/leddht11"), (snapshot) => {
  if (snapshot.val() == 1) {
    document.getElementById("warnLedDht11").innerText = "Đang bật";
  } else document.getElementById("warnLedDht11").innerText = "Đang tắt";
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
var count = 4;
const charts = {};
document.getElementById("addblock").onclick = function () {
  let box = document.createElement("div");
  count += 1;
  box.className = "box box" + count;
  box.innerHTML = `
    <h2>Thêm card mới</h2>
    <form>
      <input type="text" placeholder="Nhập tên card" id = "cardName" required="required"><br>
      <label>Lựa chọn loại card</label>
      <select id="cardType">
        <option value="" selected disabled>-- Chọn loại card --</option>
        <option value="Cảm biến">Cảm biến</option>
        <option value="control">Điều khiển In Out</option>
      </select>
      <br>
      <div class="chartSelect" style="display:none;">
        <label>Lựa chọn loại biểu đồ</label>
        <select id="chartType">
          <option value="line">Biểu đồ đường</option>
          <option value="bar">Biểu đồ cột</option>
          <option value="pie">Biểu đồ tròn</option>
          <option value="doughnut">Biểu đồ vòng</option>
          <option value="mixchart">Biểu đồ hỗn hợp</option>
          <option value="none">Không</option>
        </select>
      </div>
      <br>
      <div class="PinSelect" style="display:none;">
        <label>Lựa chọn chân kết nối</label>
        <select id="selectPin">
          <option value="2">GPIO2</option>
          <option value="4">GPIO4</option>
          <option value="5">GPIO5</option>
          <option value="16">GPIO16</option>
          <option value="17">GPIO17</option>
          <option value="18">GPIO18</option>
          <option value="19">GPIO19</option>
          <option value="21">GPIO21</option>
          <option value="22">GPIO22</option>
          <option value="23">GPIO23</option>
          <option value="25">GPIO25</option>
          <option value="26">GPIO26</option>
          <option value="27">GPIO27</option>
          <option value="32">GPIO32</option>
          <option value="33">GPIO33</option>
        </select>
      </div>
      <br>
      <div class="Pin2Select" style="display:none;">
        <label>Lựa chọn chân kết nối2</label>
        <select id="selectPin2">
          <option value="2">GPIO2</option>
          <option value="4">GPIO4</option>
          <option value="5">GPIO5</option>
          <option value="16">GPIO16</option>
          <option value="17">GPIO17</option>
          <option value="18">GPIO18</option>
          <option value="19">GPIO19</option>
          <option value="21">GPIO21</option>
          <option value="22">GPIO22</option>
          <option value="23">GPIO23</option>
          <option value="25">GPIO25</option>
          <option value="26">GPIO26</option>
          <option value="27">GPIO27</option>
          <option value="32">GPIO32</option>
          <option value="33">GPIO33</option>
        </select>
      </div>
      <br>
      <button type="button" id="getInfor">Xác nhận</button>
    </form>
  `;
  const cardTypeSelect = box.querySelector("#cardType");
  const selectPin2 = box.querySelector(".Pin2Select");
  const selectChart = box.querySelector(".chartSelect");
  const selectPin = box.querySelector(".PinSelect");
  cardTypeSelect.addEventListener("change", () => {
    if (cardTypeSelect.value === "Cảm biến") {
      selectPin2.style.display = "none";
      selectChart.style.display = "block";
      selectPin.style.display = "block";
    } else {
      selectPin2.style.display = "block";
      selectChart.style.display = "none";
      selectPin.style.display = "block";
    }
  });
  document.querySelector(".container").appendChild(box);
  box.querySelector("#getInfor").onclick = function () {
    const selectChart = box.querySelector("#chartType").value;
    const selectCard = box.querySelector("#cardType").value;
    const selectPin = box.querySelector("#selectPin").value;
    let cardName = box.querySelector("#cardName").value;
    if (cardName == "") {
      cardName = "test" + count;
    }
    if (selectChart == "pie" || selectChart == "doughnut") {
      alert(
        "tính năng đang được phát triển \n bạn vui lòng chọn loại biểu đồ khác",
      );
      return;
    }
    if (selectCard == "Cảm biến") {
      alert(
        `Bạn đã chọn:
      Card: ${selectCard}
      Biểu đồ: ${selectChart}
      GPIO: ${selectPin}`,
      );
      box.innerHTML = `
        <h1 class="heading">${cardName}</h1>
        <h2>Loại card: ${selectCard}</h2>
        <h2>Chân kết nối: GPIO${selectPin}</h2>
        <h2>Loại biểu đồ: ${selectChart}</h2>
        ${
          selectChart !== "none"
            ? `<div class="card-chart">
                <canvas id="Chart${count}"></canvas>
              </div>`
            : ""
        }
      `;
      if (selectChart != "none") {
        const ctxNew = document.getElementById(`Chart${count}`);
        if (selectChart == "line") {
          charts[count] = new Chart(ctxNew, {
            data: {
              datasets: [
                {
                  type: "line",
                  label: "Độ ẩm",
                  data: [30, 40, 50, 100],
                },
              ],
              labels: [0, 1, 2, 3],
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          });
        } else if (selectChart == "bar") {
          charts[count] = new Chart(ctxNew, {
            data: {
              datasets: [
                {
                  type: "bar",
                  label: "Nhiệt độ",
                  data: [10, 30, 100, 40, 50],
                },
              ],
              labels: [0, 1, 2, 3, 4],
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          });
        } else if (selectChart == "mixchart") {
          charts[count] = new Chart(ctxNew, {
            data: {
              datasets: [
                {
                  type: "bar",
                  label: "Nhiệt độ",
                  data: [10, 30, 40, 100],
                },
                {
                  type: "line",
                  label: "Độ ẩm",
                  data: [40, 50, 10, 40],
                },
              ],
              labels: [0, 1, 2, 3],
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          });
        }
      }
    } else if (selectCard == "control") {
      const selectPin2 = box.querySelector("#selectPin2").value;
      if (selectPin == selectPin2) {
        alert("vui lòng thay đổi chân GPIO");
        return;
      }
      alert(
        `Bạn đã chọn:
      Card: ${selectCard}
      GPIO: ${selectPin}
      GPIO2: ${selectPin2}`,
      );
      box.innerHTML = `
        <h1 class="heading">${cardName}</h1>
        <h2>Loại card: ${selectCard}</h2>
        <h2>Chân kết nối: GPIO${selectPin}</h2>
        <h2>Chân kết nối2: GPIO${selectPin2}</h2>
        <div class="button_group">
          <button id="btn-inout3">IN 1</button>
          <p id="status1">OUT 1 Đang tắt</p>
          <button id="btn-inout4">IN 2</button>
          <p id="status2">OUT 2 Đang tắt</p>
        </div>
      `;
    }
  };
};
document.getElementById("chatbot").onclick = function () {
  alert("Tính năng Chat Bot AI đang được phát triển!");
};
let live1 = false;
document.getElementById("live").onclick = function () {
  live1 = !live1;
  const ele = document.getElementById("live");
  const zoomOpt = mixedChart2.options.plugins.zoom;
  if (live1) {
    zoomOpt.zoom.wheel.enabled = false;
    zoomOpt.zoom.pinch.enabled = false;
    zoomOpt.pan.enabled = false;
    mixedChart2.resetZoom();
    ele.style.backgroundColor = "rgb(255, 0, 0)";
  } else {
    zoomOpt.zoom.wheel.enabled = true;
    zoomOpt.zoom.pinch.enabled = true;
    zoomOpt.pan.enabled = true;
    ele.style.backgroundColor = "rgb(255, 215, 215)";
  }
  mixedChart2.update("none");
};
let live2 = false;
document.getElementById("live2").onclick = function () {
  live2 = !live2;
  const ele = document.getElementById("live2");

  const zoomOpt = mixedChart.options.plugins.zoom;

  if (live2) {
    zoomOpt.zoom.wheel.enabled = false;
    zoomOpt.zoom.pinch.enabled = false;
    zoomOpt.pan.enabled = false;
    mixedChart.resetZoom();
    ele.style.backgroundColor = "rgb(255, 0, 0)";
  } else {
    zoomOpt.zoom.wheel.enabled = true;
    zoomOpt.zoom.pinch.enabled = true;
    zoomOpt.pan.enabled = true;
    ele.style.backgroundColor = "rgb(255, 215, 215)";
  }
  mixedChart.update("none");
};
document.getElementById("Warnbtn1").onclick = function () {
  let tempCB = document.getElementById("WarnInfoTemp1").value;
  let humiCB = document.getElementById("WarnInfoHumi1").value;
  tempCB = Number(tempCB);
  humiCB = Number(humiCB);
  set(ref(db, "CBNDBME"), tempCB);
  set(ref(db, "CBDABME"), humiCB);
  alert(
    `Bạn đã cài đặt thành công ngưỡng:
Nhiệt độ: ${tempCB}
Độ ẩm: ${humiCB}
Cho cảm biến BME280`,
  );
};
document.getElementById("Warnbtn2").onclick = function () {
  let tempCB = document.getElementById("WarnInfoTemp2").value;
  let humiCB = document.getElementById("WarnInfoHumi2").value;
  tempCB = Number(tempCB);
  humiCB = Number(humiCB);
  set(ref(db, "CBNDDht11"), tempCB);
  set(ref(db, "CBDADht11"), humiCB);
  alert(
    `Bạn đã cài đặt thành công ngưỡng:
Nhiệt độ: ${tempCB}
Độ ẩm: ${humiCB}
Cho cảm biến DHT11`,
  );
};
