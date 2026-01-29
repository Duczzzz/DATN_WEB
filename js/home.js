let count = Number(localStorage.getItem("cardCount")) || 4;
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

const user = localStorage.getItem("username");
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

function saveCardToLocal(cardData) {
  let cards = JSON.parse(localStorage.getItem("cards")) || [];
  cards.push(cardData);
  localStorage.setItem("cards", JSON.stringify(cards));
}
window.onload = () => {
  const cards = JSON.parse(localStorage.getItem("cards")) || [];
  cards.forEach((card) => {
    let box = document.createElement("div");
    box.className = "box box" + card.id;
    document.querySelector(".container").appendChild(box);
    if (card.type == "Sensor") {
      box.innerHTML = `
        <h1 class="heading">${card.name}</h1>
        <h2>Loại card: ${card.type}</h2>
        <h2>Chân kết nối: GPIO${card.pin1}</h2>
        <h2>Loại biểu đồ: ${card.chartType}</h2>
        <form>
          <label>Ngưỡng nhiệt độ (°C)</label>
          <input
            id="temp${card.id}"
            type="number"
            step="0.1"
            min="0"
            max="100"
            placeholder="Nhập giá trị"
          />
          <br />
          <label>Ngưỡng độ ẩm (%)</label>
          <input
            id="hum${card.id}"
            type="number"
            step="0.1"
            min="0"
            max="100"
            placeholder="Nhập giá trị"
          />
          <button type="button" id="Warnbtn-${card.id}">Cài đặt</button>
        </form>
        <button class="golive" id="live-${card.id}">
          <img src="img/stream.png" alt="lỗi tải ảnh" />
        </button>
        ${
          card.chartType !== "none"
            ? `<div class="card-chart">
                <canvas id="Chart${card.id}"></canvas>
              </div>`
            : ""
        }
      `;
      if (card.chartType != "none") {
        const ctxNew = document.getElementById(`Chart${card.id}`);
        if (card.chartType == "line") {
          charts[card.id] = new Chart(ctxNew, {
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
        } else if (card.chartType == "bar") {
          charts[card.id] = new Chart(ctxNew, {
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
        } else if (card.chartType == "mixchart") {
          charts[card.id] = new Chart(ctxNew, {
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
        }
      }
    } else {
      set(ref(db, `users/${user}/Out/Out-${card.id}-1`), 0);
      set(ref(db, `users/${user}/Out/Out-${card.id}-2`), 0);
      box.innerHTML = `
        <h1 class="heading">${card.name}</h1>
        <h2>Loại card: ${card.type}</h2>
        <h2>Chân kết nối: GPIO${card.pin1}</h2>
        <h2>Chân kết nối2: GPIO${card.pin2}</h2>
        <div class="button_group">
          <button class="btnControl" id="btnin-${card.id}-1">IN 1</button>
          <p id="status-${card.id}-1">OUT 1 Đang tắt</p>
          <button class="btnControl" id="btnin-${card.id}-2">IN 2</button>
          <p id="status-${card.id}-2">OUT 2 Đang tắt</p>
        </div>
      `;
    }
  });
};

const charts = {};
document.getElementById("addblock").onclick = function () {
  let box = document.createElement("div");
  count++;
  localStorage.setItem("cardCount", count);
  box.className = "box box" + count;
  box.innerHTML = `
    <h2>Thêm card mới</h2>
    <form>
      <input type="text" placeholder="Nhập tên card" id = "cardName" required="required"><br>
      <label>Lựa chọn loại card</label>
      <select id="cardType">
        <option value="" selected disabled>-- Chọn loại card --</option>
        <option value="Sensor">Cảm biến</option>
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
    if (cardTypeSelect.value === "Sensor") {
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
    var saved = 0;
    if (cardName == "") {
      cardName = "test" + count;
    }
    if (selectChart == "pie" || selectChart == "doughnut") {
      alert(
        "tính năng đang được phát triển \n bạn vui lòng chọn loại biểu đồ khác",
      );
      return;
    }
    if (selectCard == "Sensor") {
      alert(
        `Bạn đã chọn:
      Card: ${selectCard}
      Biểu đồ: ${selectChart}
      GPIO: ${selectPin}`,
      );
      saveCardToLocal({
        id: count,
        name: cardName,
        type: selectCard,
        pin1: selectPin,
        pin2: null,
        chartType: selectChart,
      });
      saved = 1;
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
      saveCardToLocal({
        id: count,
        name: cardName,
        type: selectCard,
        pin1: selectPin,
        pin2: selectPin2,
        chartType: null,
      });
      saved = 1;
    }
    if (saved == 1) {
      setTimeout(() => {
        location.reload();
      }, 300);
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

document.getElementById("removeblock").onclick = function () {
  let box = document.createElement("div");
  box.className = "delete";
  box.innerHTML = `
    <form>
      <label>Lựa chọn card cần xóa</label>
      <select id="chooseCard"></select>
      <br><br>
      <button type="button" id="confirmDelete">Xóa</button>
      <button type="button" id="cancelDelete">Hủy</button>
    </form>
  `;
  document.querySelector(".container").style.display = "none";
  document.querySelector(".remove").appendChild(box);
  const select = box.querySelector("#chooseCard");
  const cards = JSON.parse(localStorage.getItem("cards")) || [];
  cards.forEach((card) => {
    const option = document.createElement("option");
    option.value = card.id;
    option.textContent = `Card ${card.id} - ${card.name}`;
    select.appendChild(option);
    console.log(option.text);
  });
  box.querySelector("#cancelDelete").onclick = () => {
    box.remove();
    document.body.classList.remove("box");
    location.reload();
  };
  box.querySelector("#confirmDelete").onclick = () => {
    const selectedId = Number(select.value);
    const newCards = cards.filter((card) => card.id !== selectedId);
    remove(ref(db, `users/${user}/Out/Out-${selectedId}-1`));
    remove(ref(db, `users/${user}/Out/Out-${selectedId}-2`));
    remove(ref(db, `users/${user}/In/In-${selectedId}-1`));
    remove(ref(db, `users/${user}/In/In-${selectedId}-2`));
    alert("Đã xóa card: " + selectedId);
    localStorage.setItem("cards", JSON.stringify(newCards));
    location.reload();
  };
};

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".btnControl");
  if (!btn) return;
  const box = btn.closest(".box");
  if (!box) return;
  const parts = btn.id.split("-");
  const inId = Number(parts[1]);
  const channel = Number(parts[2]);
  const btnId = btn.id;
  console.log(channel);
  console.log(btnId);
  const currentCL = getComputedStyle(btn).backgroundColor;
  if (currentCL == "rgb(255, 152, 152)") {
    set(ref(db, `users/${user}/In/In-${inId}-${channel}`), 1);
    btn.style.backgroundColor = "rgb(41, 63, 255)";
  } else {
    set(ref(db, `users/${user}/In/In-${inId}-${channel}`), 0);
    btn.style.backgroundColor = "rgb(255, 152, 152)";
  }
});

const path = `users/${user}/Out`;
onValue(ref(db, path), (snapshot) => {
  const inData = snapshot.val();
  if (!inData) return;
  Object.entries(inData).forEach(([key, val]) => {
    const parts = key.split("-");
    // console.log(parts[0], parts[1], parts[2]);
    const stt = document.getElementById(`status-${parts[1]}-${parts[2]}`);
    if (val == 1) {
      stt.innerText = `OUT ${parts[1]} Đang bật`;
    } else {
      stt.innerText = `OUT ${parts[1]} Đang tắt`;
    }
  });
});

let live3 = false;
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".golive");
  if (!btn) return;
  const cardId = Number(btn.id.replace("live-", ""));
  live3 = !live3;
  const ele = document.getElementById(`live-${cardId}`);
  const zoomOpt = charts[cardId].options.plugins.zoom;
  if (live3) {
    zoomOpt.zoom.wheel.enabled = false;
    zoomOpt.zoom.pinch.enabled = false;
    zoomOpt.pan.enabled = false;
    charts[cardId].resetZoom();
    ele.style.backgroundColor = "rgb(255, 0, 0)";
  } else {
    zoomOpt.zoom.wheel.enabled = true;
    zoomOpt.zoom.pinch.enabled = true;
    zoomOpt.pan.enabled = true;
    ele.style.backgroundColor = "rgb(255, 215, 215)";
  }
  charts[cardId].update("none");
});
document.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  const parts = btn.id.split("-");
  const cardId = parts[1];
  if (parts[0] != "Warnbtn") {
    return;
  } else {
    let tempCB = document.getElementById(`temp${cardId}`).value;
    let humiCB = document.getElementById(`hum${cardId}`).value;
    tempCB = Number(tempCB);
    humiCB = Number(humiCB);
    alert(
      `Bạn đã cài đặt thành công:
  Nhiệt độ ngưỡng: ${tempCB}
  Độ ẩm ngưỡng: ${humiCB}`,
    );
  }
});
