let count = Number(localStorage.getItem("cardCount")) || 4;
const user = localStorage.getItem("username");

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

window.scrollTo({
  top: 0,
  behavior: "smooth",
});

// const source = await fetch(
//   "https://raw.githubusercontent.com/Duczzzz/DATN_WEB/main/js/home.js",
// ).then((r) => r.text());

async function loadhdsd() {
  const hdsdRaw = await fetch(
    "https://raw.githubusercontent.com/Duczzzz/DATN_WEB/main/hdsd.txt",
  ).then((r) => r.text());
  return hdsdRaw.replaceAll("{user}", user);
}

async function initchat() {
  // const fullsrc = document.documentElement.outerHTML;
  // console.log(fullsrc);
  const response = await fetch(
    "https://reptiloid-natasha-gentlemanly.ngrok-free.dev/v1/chat/completions",
    {
      method: "POST",
      body: JSON.stringify({
        // model: "gpt-oss:120b-cloud",
        model: "gemma3:4b",
        messages: [
          {
            role: "system",
            content: `
          Bạn là trợ lý ảo cho nền tảng của tôi. Nền tảng có tên Nuke Board. Bạn chỉ cần trả lời ngắn gọn 3-4 dòng
          `,
          },
          {
            role: "user",
            content: "bạn là ai",
          },
        ],
        temperature: 0,
        stream: false,
      }),
    },
  );
  const data = await response.json();
  let box = document.createElement("div");
  box.className = "msg bot";
  box.innerText = `${data.choices[0].message.content}
  `;
  document.querySelector("#chatBody").appendChild(box);
}
initchat();
async function chatNor(msgu) {
  const hdsd = await loadhdsd();
  const response = await fetch(
    "https://reptiloid-natasha-gentlemanly.ngrok-free.dev/v1/chat/completions",
    {
      method: "POST",
      body: JSON.stringify({
        // model: "gpt-oss:120b-cloud",
        model: "gemma3:4b",
        messages: [
          {
            role: "system",
            content: `
          Bạn là trợ lý ảo cho nền tảng của tôi. Hãy trả lời cho người dùng ngắn gọn nhất có thể bằng tiếng việt.
          `,
          },
          {
            role: "user",
            content: msgu,
          },
        ],
        temperature: 0,
        stream: false,
      }),
    },
  );
  const data = await response.json();
  let box = document.createElement("div");
  box.className = "msg bot";
  box.innerText = `${data.choices[0].message.content}
  `;
  document.querySelector("#chatBody").appendChild(box);
}
async function chat(msgu) {
  const hdsd = await loadhdsd();
  const response = await fetch(
    "https://reptiloid-natasha-gentlemanly.ngrok-free.dev/v1/chat/completions",
    {
      method: "POST",
      body: JSON.stringify({
        // model: "gpt-oss:120b-cloud",
        model: "gemma3:4b",
        messages: [
          {
            role: "system",
            content: `
          Bạn là trợ lý ảo cho nền tảng của tôi.
          QUY TẮC:
          - CHỈ được trả lời dựa trên HƯỚNG DẪN SỬ DỤNG bên dưới.
          - Tôi có user là ${user} bạn hãy thay vào "{user}" trong vào đường dẫn database trong hướng dẫn sử dụng (bắt buộc).
          - KHÔNG suy đoán.
          - KHÔNG bổ sung kiến thức bên ngoài.
          - Nếu không tìm thấy thông tin, trả lời đúng duy nhất:
          "Không tìm thấy thông tin trong hướng dẫn sử dụng"
          - Nếu người dùng không yêu cầu cách tải và lấy về dữ liệu thì không trả lời.

          ĐỊNH DẠNG TRẢ LỜI (bắt buộc):
          ===Đường dẫn database===
          <ghi đúng nội dung tìm thấy>

          ===Cách tải và lấy về dữ liệu===
          <ghi đúng nội dung tìm thấy>

          ====================
          HƯỚNG DẪN SỬ DỤNG:
          ${hdsd}
          `,
          },
          {
            role: "user",
            content: msgu,
          },
        ],
        temperature: 0,
        stream: false,
      }),
    },
  );
  const data = await response.json();
  let box = document.createElement("div");
  box.className = "msg bot";
  box.innerText = `${data.choices[0].message.content}
  `;
  document.querySelector("#chatBody").appendChild(box);
}

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
    btn.innerText = "ON 1";
  } else {
    set(ref(db, "In/In1"), 0);
    btn.style.backgroundColor = "rgb(255, 152, 152)";
    btn.innerText = "OFF 1";
  }
};
document.getElementById("btn-inout2").onclick = function () {
  const btn = document.getElementById("btn-inout2");
  if (btn.style.backgroundColor == "rgb(255, 152, 152)") {
    set(ref(db, "In/In2"), 1);
    btn.style.backgroundColor = "rgb(41, 63, 255)";
    btn.innerText = "ON 2";
  } else {
    set(ref(db, "In/In2"), 0);
    btn.style.backgroundColor = "rgb(255, 152, 152)";
    btn.innerText = "OFF 2";
  }
};

function saveCardToLocal(cardData) {
  let cards = JSON.parse(localStorage.getItem("cards")) || [];
  cards.push(cardData);
  localStorage.setItem("cards", JSON.stringify(cards));
}
let x = 0;
let y = 0;
window.onload = () => {
  const cards = JSON.parse(localStorage.getItem("cards")) || [];
  if (cards.length === 0) {
    localStorage.setItem("cardCount", 4);
  }
  var drawflowContainer = document.getElementById("drawflow");
  var editor = new Drawflow(drawflowContainer);
  const maxHeight = document.querySelector("#drawflow").offsetHeight;
  editor.start();
  var espId = editor.addNode(
    "Main",
    1,
    1,
    320,
    200,
    "node",
    {},
    `<div>Core ESP32</div>`,
  );
  cards.forEach((card) => {
    let box = document.createElement("div");
    box.className = "box box" + card.id;
    document.querySelector(".container").appendChild(box);
    if (card.type == "Sensor") {
      var nodeId = editor.addNode(
        card.type,
        0,
        1,
        0,
        y,
        "hi",
        { card },
        `<div>Cardname:${card.name}</div>
      <br>
      <div>GPIO${card.pin1}</div>`,
      );
      editor.addConnection(nodeId, espId, "output_1", "input_1");
      y = y + 120;
      if (y > maxHeight) {
        document.querySelector("#drawflow").offsetHeight = Number(y);
      }
      const cardRef = ref(db, `users/${user}/Card`);
      box.innerHTML = `
        <h1 class="heading">${card.name}</h1>
        <h2>ID card: ${card.id}</h2>
        <h2>Loại card: ${card.type}</h2>
        <h2>Chân kết nối: GPIO${card.pin1}</h2>
        <h2>Loại biểu đồ: ${card.chartType}</h2>
        <form>
          <label for="temp${card.id}">Ngưỡng nhiệt độ (°C)</label>
          <input
            id="temp${card.id}"
            type="number"
            step="0.1"
            min="0"
            max="100"
            placeholder="Nhập giá trị"
          />
          <br />
          <label for="hum${card.id}">Ngưỡng độ ẩm (%)</label>
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
          get(cardRef).then((snapshot) => {
            if (!snapshot.hasChild(`Data-${card.id}-1`)) {
              set(ref(db, `users/${user}/Card/Data-${card.id}-1`), 0);
            }
          });
          charts[card.id] = new Chart(ctxNew, {
            data: {
              datasets: [
                {
                  type: "line",
                  label: card.label,
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
        } else if (card.chartType == "bar") {
          get(cardRef).then((snapshot) => {
            if (!snapshot.hasChild(`Data-${card.id}-1`)) {
              set(ref(db, `users/${user}/Card/Data-${card.id}-1`), 0);
            }
          });
          charts[card.id] = new Chart(ctxNew, {
            data: {
              datasets: [
                {
                  type: "bar",
                  label: card.label,
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
        } else if (card.chartType == "mixchart") {
          get(cardRef).then((snapshot) => {
            if (!snapshot.hasChild(`Data-${card.id}-1`)) {
              set(ref(db, `users/${user}/Card/Data-${card.id}-1`), 0);
            }
            if (!snapshot.hasChild(`Data-${card.id}-2`)) {
              set(ref(db, `users/${user}/Card/Data-${card.id}-2`), 0);
            }
          });
          charts[card.id] = new Chart(ctxNew, {
            data: {
              datasets: [
                {
                  type: "bar",
                  label: card.label,
                  data: [],
                },
                {
                  type: "line",
                  label: card.label2,
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
        }
      }
    } else {
      var nodeId = editor.addNode(
        card.type,
        1,
        0,
        650,
        x,
        "hi",
        { card },
        `<div>Cardname:${card.name}</div>
      <br>
      <div>GPIO${card.pin1}</div>
      <br>
      ${card.pin2 != null ? `<div>GPIO${card.pin2}</div>` : ``}`,
      );
      editor.addConnection(espId, nodeId, "output_1", "input_1");
      x = x + 120;
      if (x > maxHeight) {
        drawflow.style.height = x + "px";
      }
      const cardRefco = ref(db, `users/${user}/Out`);
      if (card.pin2 != null) {
        get(cardRefco).then((snapshot) => {
          if (!snapshot.hasChild(`Out-${card.id}-1`)) {
            set(ref(db, `users/${user}/Out/Out-${card.id}-1`), 0);
          }
          if (!snapshot.hasChild(`Out-${card.id}-2`)) {
            set(ref(db, `users/${user}/Out/Out-${card.id}-2`), 0);
          }
        });
        box.innerHTML = `
          <h1 class="heading">${card.name}</h1>
          <h2>ID card: ${card.id}</h2>
          <h2>Loại card: ${card.type}</h2>
          <h2>Chân kết nối: GPIO${card.pin1}</h2>
          <h2>Chân kết nối2: GPIO${card.pin2}</h2>
          <div class="button_group">
            <button class="btnControl" id="btnin-${card.id}-1">OFF ${card.pin1}</button>
            <p id="status-${card.id}-1">OUT ${card.pin1} Đang tắt</p>
            <button class="btnControl" id="btnin-${card.id}-2">OFF ${card.pin2}</button>
            <p id="status-${card.id}-2">OUT ${card.pin2} Đang tắt</p>
          </div>
        `;
      } else {
        get(cardRefco).then((snapshot) => {
          if (!snapshot.hasChild(`Out-${card.id}-1`)) {
            set(ref(db, `users/${user}/Out/Out-${card.id}-1`), 0);
          }
        });
        box.innerHTML = `
          <h1 class="heading">${card.name}</h1>
          <h2>ID card: ${card.id}</h2>
          <h2>Loại card: ${card.type}</h2>
          <h2>Chân kết nối: GPIO${card.pin1}</h2>
          <div class="button_group">
            <button class="btnControl" id="btnin-${card.id}-1">OFF ${card.pin1}</button>
            <p id="status-${card.id}-1">OUT ${card.pin1} Đang tắt</p>
          </div>
          `;
      }
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
      <input type="text" placeholder="Nhập tên card" id = "cardName"><br>
      <label for="cardType">Lựa chọn loại card</label>
      <select id="cardType">
        <option value="" selected disabled>-- Chọn loại card --</option>
        <option value="Sensor">Cảm biến</option>
        <option value="control">Điều khiển In Out</option>
      </select>
      <br>
      <div class="chartSelect" style="display:none;">
        <label for="chartType">Lựa chọn loại biểu đồ</label>
        <select id="chartType">
          <option value="line">Biểu đồ đường</option>
          <option value="bar">Biểu đồ cột</option>
          <option value="pie">Biểu đồ tròn</option>
          <option value="doughnut">Biểu đồ vòng</option>
          <option value="mixchart">Biểu đồ hỗn hợp</option>
          <option value="none">Không</option>
        </select>
        <input type="text" placeholder="Nhập nhãn biểu đồ" id = "labelchart"><br>
        <input type="text" placeholder="Nhập nhãn 2 biểu đồ" id = "labelchart2" style="display:none;"><br>
      </div>
      <br>
      <div class="SelectMuchPin" style="display:none;">
        <label for="Manypin">Lựa chọn số ngõ ra muốn điều khiển</label>
        <select id="Manypin">
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
      </div>
      <br>
      <br>
      <div class="PinSelect" style="display:none;">
        <label for="selectPin">Lựa chọn chân kết nối</label>
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
        <label for="selectPin2">Lựa chọn chân kết nối2</label>
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
      <button type="submit" id="getInfor">Xác nhận</button>
    </form>
  `;
  const cardTypeSelect = box.querySelector("#cardType");
  const selectPin2 = box.querySelector(".Pin2Select");
  const selectChart = box.querySelector(".chartSelect");
  const selectPin = box.querySelector(".PinSelect");
  const labelchart2 = box.querySelector("#labelchart2");
  const chartType = box.querySelector("#chartType");
  const SelectMuchPin = box.querySelector(".SelectMuchPin");
  const manypin = box.querySelector("#Manypin");
  cardTypeSelect.addEventListener("change", () => {
    if (cardTypeSelect.value === "Sensor") {
      selectPin2.style.display = "none";
      selectChart.style.display = "block";
      selectPin.style.display = "block";
      SelectMuchPin.style.display = "none";
    } else {
      selectChart.style.display = "none";
      selectPin.style.display = "block";
      SelectMuchPin.style.display = "block";
    }
  });
  chartType.addEventListener("change", () => {
    if (chartType.value === "mixchart") {
      labelchart2.style.display = "block";
    } else {
      labelchart2.style.display = "none";
    }
  });
  manypin.addEventListener("change", () => {
    if (manypin.value === "1") {
      selectPin2.style.display = "none";
    } else {
      selectPin2.style.display = "block";
    }
  });
  document.querySelector(".container").appendChild(box);
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
  const select = document.getElementById("selectPin");
  const select2 = document.getElementById("selectPin2");
  const cards = JSON.parse(localStorage.getItem("cards")) || [];
  const usedPins = new Set();
  cards.forEach((card) => {
    console.log(card.pin1, card.pin2);
    if (card.pin1 != null) usedPins.add(card.pin1);
    if (card.pin2 != null) usedPins.add(card.pin2);
  });
  [...select.options].forEach((option) => {
    if (usedPins.has(option.value)) option.remove();
  });

  [...select2.options].forEach((option) => {
    if (usedPins.has(option.value)) option.remove();
  });
  if (select.options.length === 0 && select2.options.length === 0) {
    alert(
      "đã sử dụng hết tài nguyên của hệ thống, để có thể tiếp tục tạo card mới thì xin vui lòng xóa card cũ",
    );
    setTimeout(() => {
      location.reload();
    }, 300);
  }
  box.querySelector("#getInfor").onclick = function () {
    const selectChart = box.querySelector("#chartType").value;
    const selectCard = box.querySelector("#cardType").value;
    const selectPin = box.querySelector("#selectPin").value;
    let cardName = box.querySelector("#cardName").value;
    const labelchart = box.querySelector("#labelchart").value;
    const labelchart2 = box.querySelector("#labelchart2").value;
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
      if (selectChart == "mixchart") {
        if (labelchart2 == "") {
          alert("vui lòng bổ sung nhãn 2 cho biểu đồ,vui lòng tạo lại card");
          return;
        }
      } else {
        if (labelchart == "") {
          alert("vui lòng bổ sung nhãn cho biểu đồ,vui lòng tạo lại card");
          return;
        }
      }
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
        label: labelchart,
        label2: labelchart2,
      });
      saved = 1;
    } else if (selectCard == "control") {
      const manypin = box.querySelector("#Manypin").value;
      if (manypin == "1") {
        alert(
          `Bạn đã chọn:
        Card: ${selectCard}
        OUT1: GPIO${selectPin}`,
        );
        saveCardToLocal({
          id: count,
          name: cardName,
          type: selectCard,
          pin1: selectPin,
          pin2: null,
          chartType: null,
        });
      } else {
        const selectPin2 = box.querySelector("#selectPin2").value;
        if (selectPin == selectPin2) {
          alert("vui lòng thay đổi chân GPIO");
          return;
        }
        alert(
          `Bạn đã chọn:
      Card: ${selectCard}
      OUT1: ${selectPin}
      OUT2: ${selectPin2}`,
        );
        saveCardToLocal({
          id: count,
          name: cardName,
          type: selectCard,
          pin1: selectPin,
          pin2: selectPin2,
          chartType: null,
        });
      }
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
      <label for="chooseCard">Lựa chọn card cần xóa</label>
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
    const cardToDelete = cards.find((card) => card.id === selectedId);
    if (cardToDelete.chartType == null) {
      if (cardToDelete.pin2 == null) {
        remove(ref(db, `users/${user}/Out/Out-${selectedId}-1`));
        remove(ref(db, `users/${user}/In/In-${selectedId}-1`));
      } else {
        remove(ref(db, `users/${user}/Out/Out-${selectedId}-1`));
        remove(ref(db, `users/${user}/Out/Out-${selectedId}-2`));
        remove(ref(db, `users/${user}/In/In-${selectedId}-1`));
        remove(ref(db, `users/${user}/In/In-${selectedId}-2`));
      }
    } else if (cardToDelete.chartType == "mixchart") {
      remove(ref(db, `users/${user}/Card/Data-${selectedId}-1`));
      remove(ref(db, `users/${user}/Card/Data-${selectedId}-2`));
      remove(ref(db, `users/${user}/Card/Data-${selectedId}-CB1`));
      remove(ref(db, `users/${user}/Card/Data-${selectedId}-CB2`));
    } else {
      remove(ref(db, `users/${user}/Card/Data-${selectedId}-1`));
      remove(ref(db, `users/${user}/Card/Data-${selectedId}-CB1`));
      remove(ref(db, `users/${user}/Card/Data-${selectedId}-CB2`));
    }
    const newCards = cards.filter((card) => card.id !== selectedId);
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
  if (parts[1] == "inout1" || parts[1] == "inout2") {
    return;
  }
  const inId = Number(parts[1]);
  const channel = Number(parts[2]);
  const currentCL = getComputedStyle(btn).backgroundColor;
  const cards = JSON.parse(localStorage.getItem("cards")) || [];
  cards.forEach((card) => {
    if (card.id == inId) {
      if (parts[2] == "1") {
        if (currentCL == "rgb(255, 152, 152)") {
          set(ref(db, `users/${user}/In/In-${inId}-${channel}`), 1);
          btn.style.backgroundColor = "rgb(41, 63, 255)";
          btn.innerText = `ON ${card.pin1}`;
        } else {
          set(ref(db, `users/${user}/In/In-${inId}-${channel}`), 0);
          btn.style.backgroundColor = "rgb(255, 152, 152)";
          btn.innerText = `OFF ${card.pin1}`;
        }
      } else {
        if (currentCL == "rgb(255, 152, 152)") {
          set(ref(db, `users/${user}/In/In-${inId}-${channel}`), 1);
          btn.style.backgroundColor = "rgb(41, 63, 255)";
          btn.innerText = `ON ${card.pin2}`;
        } else {
          set(ref(db, `users/${user}/In/In-${inId}-${channel}`), 0);
          btn.style.backgroundColor = "rgb(255, 152, 152)";
          btn.innerText = `OFF ${card.pin2}`;
        }
      }
    }
  });
});

const path = `users/${user}/Out`;
onValue(ref(db, path), (snapshot) => {
  const inData = snapshot.val();
  if (!inData) return;
  const cards = JSON.parse(localStorage.getItem("cards")) || [];
  if (cards.length === 0) {
    return;
  }
  Object.entries(inData).forEach(([key, val]) => {
    const parts = key.split("-");
    const stt = document.getElementById(`status-${parts[1]}-${parts[2]}`);
    const card = cards.find((c) => c.id === Number(parts[1]));
    if (!card) return;
    if (card.id === Number(parts[1])) {
      const pin = parts[2] === "1" ? card.pin1 : card.pin2;
      const state = val === 1 ? "Đang bật" : "Đang tắt";
      stt.innerText = `OUT ${pin} ${state}`;
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

onValue(ref(db, `users/${user}/Card`), (snapshot) => {
  const cards = JSON.parse(localStorage.getItem("cards")) || [];
  if (cards.length === 0) {
    return;
  }
  const Data = snapshot.val();
  if (!Data) return;
  Object.entries(Data).forEach(([key, val]) => {
    const parts = key.split("-");
    const cardId = parts[1];
    const time = new Date().toLocaleTimeString();
    charts[cardId].data.labels.push(time);
    if (parts[2] == "CB1" || parts[2] == "CB2") return;
    if (parts[2] == "1") {
      charts[cardId].data.datasets[0].data.push(val);
    } else {
      charts[cardId].data.datasets[1].data.push(val);
    }
    charts[cardId].update("none");
  });
});

document.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const parts = btn.id.split("-");
  const cardId = parts[1];
  if (parts[0] != "Warnbtn") {
    return;
  } else {
    let tempCB = document.getElementById(`temp${cardId}`).value;
    let humiCB = document.getElementById(`hum${cardId}`).value;
    tempCB = Number(tempCB);
    humiCB = Number(humiCB);
    set(ref(db, `users/${user}/Card/Data-${cardId}-CB1`), tempCB);
    set(ref(db, `users/${user}/Card/Data-${cardId}-CB2`), humiCB);
    alert(
      `
    Bạn đã cài đặt thành công:
    Nhiệt độ ngưỡng: ${tempCB}
    Độ ẩm ngưỡng: ${humiCB}`,
    );
  }
});

document.addEventListener("change", function (e) {
  const parts = e.target.id.split("-");
  if (parts[0] != "SW") return;
  const txt = document.getElementById(`txt-${parts[1]}`);
  if (e.target.matches('input[type="checkbox"]')) {
    if (e.target.checked) {
      txt.style.display = "block";
    } else {
      txt.style.display = "none";
    }
  }
});

document.getElementById("logout").onclick = function () {
  window.location.href = "index.html";
};

document.getElementById("chat").onclick = function () {
  document.querySelector(".chat").style.display = "block";
};
document.getElementById("closeChat").onclick = function () {
  document.querySelector(".chat").style.display = "none";
};
document.getElementById("sendChat").onclick = function () {
  const msgu = document.querySelector("#chatInput").value;
  let box = document.createElement("div");
  box.className = "msg user";
  box.innerText = `${msgu}
  `;
  document.querySelector("#chatBody").appendChild(box);
  document.querySelector("#chatInput").value = "";
  if (msgu.includes("id") || msgu.includes("hướng dẫn")) {
    chat(msgu);
  } else {
    chatNor(msgu);
  }
};
