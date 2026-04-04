const charts = {};
let count = Number(localStorage.getItem("cardCount")) || 4;
const user = localStorage.getItem("username");
if (user == null) {
  window.location.ref = "index.html";
}
let x = 0;
let y = 0;
async function getPing(url) {
  const start = performance.now();
  try {
    await fetch(url, { cache: "no-store" });
    const end = performance.now();
    return Math.round(end - start);
  } catch {
    return null;
  }
}

async function pingMultiple() {
  const urls = [
    "https://reptiloid-natasha-gentlemanly.ngrok-free.dev",
    "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js",
  ];

  for (const url of urls) {
    const ping = await getPing(url);
    return ping;
  }
}
async function showPing() {
  const ping = await pingMultiple();
  const pingstt = document.getElementById("ping");
  if (ping !== null) {
    if (ping < 100) {
      pingstt.style.color = "#00ff88";
    } else if (ping < 200 || ping > 100) {
      pingstt.style.color = "#ff6600";
    } else {
      pingstt.style.color = "#ff0000";
    }
    pingstt.innerText = ping + "ms";
  } else {
    pingstt.innerText = "lỗi kết nối";
  }
}
setInterval(showPing, 2000);
import devtools from "https://cdn.jsdelivr.net/npm/devtools-detect@4.0.2/index.js";
const userControl = ["admin", "duc", "luong"];
function checkUser() {
  var check = userControl.includes(user);
  if (!check) {
    return false;
  } else return true;
}
if (!checkUser() && devtools.isOpen) {
  window.location.href = "home.html";
  document.getElementById("titleofhome").innerText =
    "Hệ thống phát hiện devtools đang mở, vui lòng đóng devtools để sử dụng";
}
setInterval(() => {
  if (!checkUser() && devtools.isOpen) {
    window.location.href = "home.html";
  }
}, 100);
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  child,
  set,
  onValue,
  remove,
  onDisconnect,
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
const time = new Date().toLocaleTimeString();
const userRef = ref(db, `users/${user}/logout`);
onDisconnect(userRef).set({
  time: time,
});

window.scrollTo({
  top: 0,
  behavior: "smooth",
});

async function loadhdsd() {
  const hdsdRaw = await fetch(
    "https://raw.githubusercontent.com/Duczzzz/DATN_WEB/main/hdsd.txt",
  ).then((r) => r.text());
  return hdsdRaw.replaceAll("{user}", user);
}

async function initchat() {
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
          Bạn là trợ lý ảo cho nền tảng của tôi. Nền tảng có tên Nuke DashBoard. Bạn chỉ cần trả lời ngắn gọn 3-4 dòng.
          Yêu cầu người dùng nếu cần hỏi gì thì hãy cung cấp  cho tôi thông tin sau:
          + card có id số mấy và là loại card gì, có bao nhiêu kênh ?
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
  let box = document.getElementById("chatinit");
  box.innerText = `${data.choices[0].message.content}
  `;
  document.querySelector("#chatBody").appendChild(box);
}
initchat();
async function chatNor(msgu) {
  const boxes = document.querySelectorAll(".box");
  const cardNames = Array.from(boxes).map((box) => {
    const title = box.querySelector(".heading");
    return title ? title.innerText : "Sơ đồ kết nối của board";
  });
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
          - Tôi là trợ lý ảo cho nền tảng NukeDashBoard.
          QUY TẮC:
          - Bắt buộc phải xưng tôi.
          - Tôi đang có những card sau: ${cardNames}
          - Nếu yêu cầu hướng dẫn sử dụng các card (DHT11, BME280, Điều khiển In Out1) hãy chỉ họ nhấn vào nút code test trên thanh công cụ và bạn đừng phản hồi gì thêm.
          - Khi tôi hỏi bạn phải liệt kê tất cả các card đang có hiện tại ở trên và thêm gợi ý sử dụng cho người dùng.
          - Thêm cuối dòng là Bạn cần giúp đỡ gì không hãy để tôi giúp bạn. Chỉ cần bạn nói hướng dẫn cho tôi card có id số mấy và là loại card gì, có bao nhiêu kênh ? Tôi sẽ giúp bạn.
          ĐỊNH DẠNG TRẢ LỜI (bắt buộc):
          <ghi đúng nội dung tìm thấy>
          - Các card đang có mặt trên hệ thống:
          +
          + 
          + 
          +
          `,
          },
          {
            role: "user",
            content: msgu,
          },
        ],
        temperature: 1,
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
          - Nếu yêu cầu hướng dẫn sử dụng các card (DHT11, BME280, Điều khiển In Out1) hãy chỉ họ nhấn vào nút code test trên thanh công cụ và đừng phản hồi gì thêm.
          - KHÔNG suy đoán.
          - KHÔNG bổ sung kiến thức bên ngoài.
          - Nếu không tìm thấy thông tin, trả lời đúng duy nhất:
          "Không tìm thấy thông tin trong hướng dẫn sử dụng"
          - Bắt buộc luôn luôn đính kèm theo chú ý và ví dụ trong file có ghi.
          ĐỊNH DẠNG TRẢ LỜI (bắt buộc):
          - Xin mời bạn chuyển đến trang code test và chọn userbuild để có thể code theo nhu cầu của bạn với đường dẫn database và hướng dẫn bên dưới.
          - Đoạn tin nhắn này sẽ không được lưu lại nên bạn vui lòng sao chép lại nếu cần thiết.
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
  box.className = "msg bothd";
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

onValue(ref(db, `users/${user}/dht11`), (snapshot) => {
  const data = snapshot.val();
  if (!data) return;
  const tempCB = data.CBNDDht11;
  const doamCB = data.CBDADht11;
  document.getElementById("WarnInfoTemp2").value = tempCB;
  document.getElementById("WarnInfoHumi2").value = doamCB;
  let temp = data.Temp;
  let humi = data.Humi;
  if (temp == null || humi == null) return;
  temp = temp.toFixed(1);
  humi = humi.toFixed(1);
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
onValue(ref(db, `users/${user}/bme280`), (snapshot) => {
  const data = snapshot.val();
  if (!data) return;
  let temp = data.Temp;
  let humi = data.Humi;
  const tempCB = data.CBNDBME280;
  const doamCB = data.CBDABME280;
  document.getElementById("WarnInfoTemp1").value = tempCB;
  document.getElementById("WarnInfoHumi1").value = doamCB;
  temp = temp.toFixed(1);
  humi = humi.toFixed(1);
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
onValue(ref(db, `users/${user}/Out`), (snapshot) => {
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
onValue(ref(db, `users/${user}/bme280/ledbme280`), (snapshot) => {
  if (snapshot.val() == 1) {
    document.getElementById("warnLedBME280").innerText = "Đang bật";
  } else document.getElementById("warnLedBME280").innerText = "Đang tắt";
});
onValue(ref(db, `users/${user}/dht11/leddht11`), (snapshot) => {
  if (snapshot.val() == 1) {
    document.getElementById("warnLedDht11").innerText = "Đang bật";
  } else document.getElementById("warnLedDht11").innerText = "Đang tắt";
});
document.getElementById("btn-inout1").onclick = function () {
  const btn = document.getElementById("btn-inout1");
  if (btn.style.backgroundColor == "rgb(255, 152, 152)") {
    set(ref(db, `users/${user}/In/In1`), 1);
    btn.style.backgroundColor = "rgb(41, 63, 255)";
    btn.innerText = "ON 1";
  } else {
    set(ref(db, `users/${user}/In/In1`), 0);
    btn.style.backgroundColor = "rgb(255, 152, 152)";
    btn.innerText = "OFF 1";
  }
};
document.getElementById("btn-inout2").onclick = function () {
  const btn = document.getElementById("btn-inout2");
  if (btn.style.backgroundColor == "rgb(255, 152, 152)") {
    set(ref(db, `users/${user}/In/In2`), 1);
    btn.style.backgroundColor = "rgb(41, 63, 255)";
    btn.innerText = "ON 2";
  } else {
    set(ref(db, `users/${user}/In/In2`), 0);
    btn.style.backgroundColor = "rgb(255, 152, 152)";
    btn.innerText = "OFF 2";
  }
};
onValue(ref(db, `users/${user}/Out`), (snapshot) => {
  const btn1 = document.getElementById("btn-inout1");
  const btn2 = document.getElementById("btn-inout2");
  const data = snapshot.val();
  if (data.Out1 == 1) {
    set(ref(db, `users/${user}/In/In1`), 1);
    btn1.innerText = "ON 1";
    btn1.style.backgroundColor = "rgb(41, 63, 255)";
  }
  if (data.Out1 == 0) {
    set(ref(db, `users/${user}/In/In1`), 0);
    btn1.innerText = "OFF 1";
    btn1.style.backgroundColor = "rgb(255, 152, 152)";
  }
  if (data.Out2 == 1) {
    set(ref(db, `users/${user}/In/In2`), 1);
    btn2.innerText = "ON 2";
    btn2.style.backgroundColor = "rgb(41, 63, 255)";
  }
  if (data.Out2 == 0) {
    set(ref(db, `users/${user}/In/In2`), 0);
    btn2.innerText = "OFF 2";
    btn2.style.backgroundColor = "rgb(255, 152, 152)";
  }
});
function formatTime(hour, minute) {
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
}
onValue(ref(db, `users/${user}/Card/timeControl`), (snapshot) => {
  const data = snapshot.val();
  let timestart = formatTime(data.hourstart, data.minutestart);
  let timeend = formatTime(data.hourend, data.minuteend);
  document.getElementById("time1").value = timestart;
  document.getElementById("time2").value = timeend;
  var status = data.statusMotor;
  if (status == 1) {
    document.getElementById("motorStatus").innerText = "Đang bật";
  } else {
    document.getElementById("motorStatus").innerText = "Đang tắt";
  }
});
document.getElementById("setTime").onclick = function () {
  var timestart = document.getElementById("time1").value;
  var timeend = document.getElementById("time2").value;
  timestart = timestart.split(":");
  timeend = timeend.split(":");
  set(ref(db, `users/${user}/Card/timeControl`), {
    hourstart: Number(timestart[0]),
    hourend: Number(timeend[0]),
    minutestart: Number(timestart[1]),
    minuteend: Number(timeend[1]),
  });
};
function saveCardToLocal(cardData) {
  let cards = JSON.parse(localStorage.getItem("cards")) || [];
  cards.push(cardData);
  localStorage.setItem("cards", JSON.stringify(cards));
}
async function loadData() {
  try {
    const snapshot = await get(ref(db, `users/${user}/storage`));
    if (!snapshot.exists()) {
      console.log("Không có dữ liệu");
      return;
    }
    const data = snapshot.val();
    localStorage.removeItem("cards");
    Object.entries(data).forEach(([key, card]) => {
      localStorage.setItem("cardCount", key);
      var infor = {
        id: card.id,
        name: card.name,
        type: card.type,
        pin1: card.pin1,
        pin2: null,
        chartType: card.chartType,
        label: card.label,
        label2: card.label2,
      };
      saveCardToLocal(infor);
    });
  } catch (err) {
    alert("có lỗi xảy ra khi đồng bộ dữ liệu, vui lòng làm mới lại trang");
  }
}
window.onload = async () => {
  await loadData();
  const cards = JSON.parse(localStorage.getItem("cards")) || [];
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
    if (card.type === "Sensor") {
      box.className = "cb box box" + card.id;
    } else {
      box.className = "ct box box" + card.id;
    }
    document.querySelector(".container").appendChild(box);
    let name = document.createElement("input");
    name.type = "checkbox";
    if (card.type == "Sensor") {
      name.id = "cb-box-" + card.id;
    } else {
      name.id = "box-" + card.id;
    }
    name.checked = true;
    let label = document.createElement("label");
    label.htmlFor = card.id;
    label.innerText = " " + card.name;
    let br = document.createElement("br");
    document.querySelector(".list").append(br, name, label, br);
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
        <div class="content">
        <h1 class="heading">${card.name}</h1>
        <h2>ID card: ${card.id}</h2>
        <h2>Loại card: ${card.type}</>
        <h2>Chân kết nối: GPIO${card.pin1}</>
        <h2>Loại biểu đồ: ${card.chartType}</>
        ${
          card.chartType == "line" || card.chartType == "bar"
            ? `
            <h2>${card.label}:<span id="value1-${card.id}">...</span></h2>
            <h2>Trạng thái đèn cảnh báo: <span id="Warnled-${card.id}">...</span></h2>
            <form>
              <label for="channel1-${card.id}-CB1">Ngưỡng cho ${card.label}</label>
              <input
                id="channel1-${card.id}-CB1"
                type="number"
                step="0.1"
                min="0"
                max="100"
                placeholder="Nhập giá trị"
              />
              <button type="button" id="Warnbtn-${card.id}">Cài đặt</button>
            </form>
            `
            : `
            <h2>${card.label}:<span id="value1-${card.id}">...</span></h2>
            <h2>${card.label2}:<span id="value2-${card.id}">...</span></h2>
            <h2>Trạng thái đèn cảnh báo: <span id="Warnled-${card.id}">...</span></h2>
            <form class"warn_cb">
              <label for="channel1-${card.id}-CB1">Ngưỡng cho ${card.label}</label>
              <input
                id="channel1-${card.id}-CB1"
                type="number"
                step="0.1"
                min="0"
                max="100"
                placeholder="Nhập giá trị"
              />
              <br />
              <label for="channel2-${card.id}-CB2">Ngưỡng cho ${card.label2}</label>
              <input
                id="channel2-${card.id}-CB2"
                type="number"
                step="0.1"
                min="0"
                max="100"
                placeholder="Nhập giá trị"
              />
              <button type="button" id="Warnbtn-${card.id}">Cài đặt</button>
            </form>
            `
        }
        </div>
        ${
          card.chartType !== "none"
            ? `<div class="card-chart">
                <button class="golive" id="live-${card.id}">
                  <img src="img/stream.png" alt="lỗi tải ảnh" />
                </button>
                <canvas id="Chart${card.id}"></canvas>
              </div>`
            : ""
        }
        <div class="swBTN">
          <p>Hướng dẫn sử dụng</p>
          <label class="switch">
            <input type="checkbox" id="SW-${card.id}"/>
            <span class="slider round"></span>
          </label>
        </div>
        ${
          card.chartType == "line" || card.chartType == "bar"
            ? `<div class="txt-hd">
                <p id="txt-${card.id}" style="display: none; line-height: 1.6;">
                  Để có thể sử dụng được card: <b>${card.name}</b>
                  <br>
                  Bạn vui lòng sử dụng đường dẫn và hướng dẫn bên dưới
                  <br> - Đường dẫn database:
                  <span class="ref-dtb">"users/${user}/Card/Data-${card.id}-1"</span>
                  <br> - Cài đặt giá trị kênh thông tin 1:
                  <span class="ref-dtb">
                    Firebase.setFloat(fbdo,"users/${user}/Card/Data-${card.id}-1", #giá_trị)
                  </span>
                  <br>
                    - Cài đặt giá trị cho đèn cảnh báo:
                  <span class="ref-dtb">
                    Firebase.setInt(fbdo,"users/${user}/Card/Data-${card.id}-Warnled",#giá_trị)
                  </span>
                  <br> - Tải về giá trị ngưỡng cảnh báo kênh 1:
                  <span class="ref-dtb">
                    Firebase.getFloat(fbdo,"users/${user}/Card/Data-${card.id}-CB1")
                  </span>
                  <br> * Chú ý:
                  <br> - Dữ liệu tải về từ database là json nên phải chuyển đổi sang Interge hoặc Float để sử dụng
                  <br> - Ví dụ:
                  <br> + <span class="ref-dtb">
                    getFloat(fbdo,"users/${user}/Card/Data-${card.id}-CB1");
                  </span>
                  <br> + <span class="ref-dtb">
                    float tempCB = fbdo.floatData();
                  </span>
                </p>
                </div>`
            : `
            <div class="txt-hd">
              <p id="txt-${card.id}" style="display: none; line-height: 1.6">
                Để có thể sử dụng được card: <b>${card.name}</b>
                <br />
                Bạn vui lòng sử dụng đường dẫn và hướng dẫn bên dưới <br />
                - Đường dẫn database kênh 1: <br />
                <span class="ref-dtb">"users/${user}/Card/Data-${card.id}-1"</span> <br />
                - Đường dẫn database kênh 2: <br />
                <span class="ref-dtb">"users/${user}/Card/Data-${card.id}-2"</span> <br />
                - Cài đặt giá trị kênh 1: <br />
                <span class="ref-dtb">
                  setFloat(fbdo,"users/${user}/Card/Data-${card.id}-1", #giá_trị)
                </span>
                <br />
                - Cài đặt giá trị kênh 2: <br />
                <span class="ref-dtb">
                  setFloat(fbdo,"users/${user}/Card/Data-${card.id}-2", #giá_trị)
                </span>
                <br />
                    - Cài đặt giá trị cho đèn cảnh báo:
                  <span class="ref-dtb">
                    setInt(fbdo,"users/${user}/Card/Data-${card.id}-Warnled",#giá_trị)
                  </span> 
                  <br>
                - Tải về giá trị ngưỡng cảnh báo kênh 1: <br />
                <span class="ref-dtb">
                  getFloat(fbdo,"users/${user}/Card/Data-${card.id}-CB1")
                </span>
                <br />
                - Tải về giá trị ngưỡng cảnh báo kênh 2: <br />
                <span class="ref-dtb">
                  getFloat(fbdo,"users/${user}/Card/Data-${card.id}-CB2")
                </span>
                <br />
                * Chú ý: <br />
                - Dữ liệu tải về từ database là json nên phải chuyển đổi sang Integer hoặc Float để sử dụng <br />
                - Ví dụ: <br />
                <span class="ref-dtb">
                  getFloat(fbdo,"users/${user}/Card/Data-${card.id}-CB1");
                </span>
                <br />
                <span class="ref-dtb">
                  float tempCB = fbdo.floatData();
                </span>
              </p
            </div>
            `
        }
      `;
      if (card.chartType != "none") {
        const ctxNew = document.getElementById(`Chart${card.id}`);
        if (card.chartType == "line") {
          get(cardRef).then((snapshot) => {
            if (!snapshot.hasChild(`Data-${card.id}-1`)) {
              set(ref(db, `users/${user}/Card/Data-${card.id}-1`), 0);
            }
            if (!snapshot.hasChild(`Data-${card.id}-Warnled`)) {
              set(ref(db, `users/${user}/Card/Data-${card.id}-Warnled`), 0);
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
                  // max: 100,
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
            if (!snapshot.hasChild(`Data-${card.id}-Warnled`)) {
              set(ref(db, `users/${user}/Card/Data-${card.id}-Warnled`), 0);
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
                  // max: 100,
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
            if (!snapshot.hasChild(`Data-${card.id}-Warnled`)) {
              set(ref(db, `users/${user}/Card/Data-${card.id}-Warnled`), 0);
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
                  // max: 100,
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
          <div class="swBTN">
            <p>Hướng dẫn sử dụng</p>
            <label class="switch">
              <<input type="checkbox" id="SW-${card.id}"/>
              <span class="slider round"></span>
            </label>
          </div>
          <div class="txt-hd">
            <p id="txt-${card.id}" style="display:none;line-height:1.6;">
              Để có thể sử dụng được card:<span class="ref-dtb">${card.name}</span>
              <br>Vui lòng sử dụng đường dẫn và hướng dẫn bên dưới
              <br>- Đường dẫn database kênh 1:
              <br><span class="ref-dtb">users/${user}/Out/Out-${card.id}-1</span>
              <br>- Cài đặt giá trị kênh 1:
              <br><span class="ref-dtb">setInt(fbdo,"users/${user}/Out/Out-${card.id}-1",#gia_tri)</span>
              <br>- Tải về giá trị kênh 1:
              <br><span class="ref-dtb">getInt(fbdo,"users/${user}/Out/Out-${card.id}-1")</span>
              <br>- Đường dẫn database kênh 2:
              <br><span class="ref-dtb">users/${user}/Out/Out-${card.id}-2</span>
              <br>- Cài đặt giá trị kênh 2:
              <br><span class="ref-dtb">setInt(fbdo,"users/${user}/Out/Out-${card.id}-2",#gia_tri)</span>
              <br>- Tải về giá trị kênh 2:
              <br><span class="ref-dtb">getInt(fbdo,"users/${user}/Out/Out-${card.id}-2")</span>
              <br>* Chú ý:
              <br>- Dữ liệu tải về từ database là <span class="ref-dtb"> JSON </span> nên cần chuyển sang<span class="ref-dtb">int</span>hoặc<span class="ref-dtb">float</span>để sử dụng
              <br>- Ví dụ:
              <br><span class="ref-dtb">getInt(fbdo,"users/${user}/Out/Out-${card.id}-2");</span>
              <br><span class="ref-dtb">int out2=fbdo.intData();</span>
            </p>
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
          <div class="swBTN">
            <p>Hướng dẫn sử dụng</p>
            <label class="switch">
              <input type="checkbox" id="SW-${card.id}"/>
              <span class="slider round"></span>
            </label>
          </div>
          <div class="txt-hd">
            <p id="txt-${card.id}" style="display:none;line-height:1.6;">
            Để có thể sử dụng được card:${card.name}
            <br>Bạn vui lòng sử dụng đường dẫn và hướng dẫn bên dưới
            <br>- Đường dẫn database:
            <br><span class="ref-dtb">users/${user}/Out/Out-${card.id}-1</span>
            <br>- Để cài đặt giá trị:
            <br><span class="ref-dtb">setInt(fbdo,"users/${user}/Out/Out-${card.id}-1",#gia_tri)</span>
            <br>- Để tải về giá trị:
            <br><span class="ref-dtb">getInt(fbdo,"users/${user}/Out/Out-${card.id}-1")</span>
            <br>* Chú ý:
            <br>- Dữ liệu tải về từ database là <span class="ref-dtb">json</span> nên phải chuyển đổi sang<span class="ref-dtb">Integer</span>hoặc<span class="ref-dtb">Float</span>để sử dụng
            <br>- Ví dụ:
            <br><span class="ref-dtb">getInt(fbdo,"users/${user}/Out/Out-${card.id}-1");</span>
            <br><span class="ref-dtb">int out1=fbdo.intData();</span>
            </p>
          </div>
          `;
      }
    }
  });
  listenFirebase();
  updateChatip();
};
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
      <button type="submit" id="cancelgetInfor">Hủy</button>
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
      const option = new Option(" I2C");
      select.add(option);
    } else {
      selectChart.style.display = "none";
      selectPin.style.display = "block";
      SelectMuchPin.style.display = "block";
      [...select.options].forEach((option) => {
        if (option.value == "I2C") option.remove();
      });
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
  const select = document.getElementById("selectPin");
  const select2 = document.getElementById("selectPin2");
  const cards = JSON.parse(localStorage.getItem("cards")) || [];
  const usedPins = new Set();
  cards.forEach((card) => {
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
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
  box.querySelector("#cancelgetInfor").onclick = function (e) {
    box.remove();
  };
  box.querySelector("#getInfor").onclick = function (e) {
    e.preventDefault();
    const selectChart = box.querySelector("#chartType").value;
    const selectCard = box.querySelector("#cardType").value;
    const selectPin = box.querySelector("#selectPin").value;
    let cardName = box.querySelector("#cardName").value;
    const labelchart = box.querySelector("#labelchart").value;
    const labelchart2 = box.querySelector("#labelchart2").value;
    const errorchartSelect = box.querySelector("#error-chartSelect");
    const errorselectPin2 = box.querySelector("#error-selectPin2");
    var saved = 0;
    if (cardName == "") {
      cardName = "test" + count;
    }
    if (selectCard == "Sensor") {
      if (selectChart == "pie" || selectChart == "doughnut") {
        alert(
          `Biểu đồ ${selectChart} đang được phát triển. Bạn vui lòng chọn loại biểu đồ khác`,
        );
        return;
      }
      if (selectChart == "mixchart") {
        if (labelchart2 == "") {
          alert("vui lòng bổ sung nhãn 2 cho biểu đồ");
          return;
        }
        if (labelchart == "") {
          alert("vui lòng bổ sung nhãn 1 cho biểu đồ");
          return;
        }
      } else {
        if (labelchart == "") {
          alert("vui lòng bổ sung nhãn 1 cho biểu đồ");
          return;
        }
      }
      alert(
        `Bạn đã chọn:
      Card: ${selectCard}
      Biểu đồ: ${selectChart}
      GPIO: ${selectPin}`,
      );
      let infor = {
        id: count,
        name: cardName,
        type: selectCard,
        pin1: selectPin,
        pin2: null,
        chartType: selectChart,
        label: labelchart,
        label2: labelchart2,
      };
      saveCardToLocal(infor);
      set(ref(db, `users/${user}/storage/${count}`), infor);
      saved = 1;
    } else if (selectCard == "control") {
      const manypin = box.querySelector("#Manypin").value;
      if (manypin == "1") {
        alert(
          `Bạn đã chọn:
        Card: ${selectCard}
        OUT1: GPIO${selectPin}`,
        );
        let infor = {
          id: count,
          name: cardName,
          type: selectCard,
          pin1: selectPin,
          pin2: null,
          chartType: null,
        };
        saveCardToLocal(infor);
        set(ref(db, `users/${user}/storage/${count}`), infor);
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
        let infor = {
          id: count,
          name: cardName,
          type: selectCard,
          pin1: selectPin,
          pin2: selectPin2,
          chartType: null,
        };
        saveCardToLocal(infor);
        set(ref(db, `users/${user}/storage/${count}`), infor);
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
    ele.style.backgroundColor = "rgba(255, 78, 78, 0.68)";
  } else {
    zoomOpt.zoom.wheel.enabled = true;
    zoomOpt.zoom.pinch.enabled = true;
    zoomOpt.pan.enabled = true;
    ele.style.backgroundColor = "rgba(255, 255, 255, 0.45)";
  }
  mixedChart.update("none");
};

document.getElementById("Warnbtn1").onclick = function () {
  let tempCB = document.getElementById("WarnInfoTemp1").value;
  let humiCB = document.getElementById("WarnInfoHumi1").value;
  tempCB = Number(tempCB);
  humiCB = Number(humiCB);
  set(ref(db, `users/${user}/bme280/CBNDBME280`), tempCB);
  set(ref(db, `users/${user}/bme280/CBDABME280`), humiCB);
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
  set(ref(db, `users/${user}/dht11/CBNDDht11`), tempCB);
  set(ref(db, `users/${user}/dht11/CBDADht11`), humiCB);
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
  });
  box.querySelector("#cancelDelete").onclick = () => {
    box.remove();
    document.body.classList.remove("box");
    location.reload();
  };
  box.querySelector("#confirmDelete").onclick = () => {
    const selectedId = Number(select.value);
    if (selectedId == 0) {
      alert("Không có card nào được chọn");
      return;
    }
    const cardToDelete = cards.find((card) => card.id === selectedId);
    remove(ref(db, `users/${user}/storage/${cardToDelete.id}`));
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
    }
    const newCards = cards.filter((card) => card.id !== selectedId);
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
function listenFirebase() {
  // Update dữ liệu cho card điều khiển In Out
  const path = `users/${user}/Out`;
  onValue(ref(db, path), (snapshot) => {
    const inData = snapshot.val();
    if (!inData) return;
    const cards = JSON.parse(localStorage.getItem("cards")) || [];
    if (cards.length === 0) {
      return;
    }
    Object.entries(inData).forEach(async ([key, val]) => {
      const parts = key.split("-");
      const stt = document.getElementById(`status-${parts[1]}-${parts[2]}`);
      const btn = document.getElementById(`btnin-${parts[1]}-${parts[2]}`);
      if (!stt) return;
      const card = cards.find((c) => c.id === Number(parts[1]));
      if (!card) return;
      if (card.id === Number(parts[1])) {
        const pin = parts[2] === "1" ? card.pin1 : card.pin2;
        const state = val === 1 ? "Đang bật" : "Đang tắt";
        stt.innerText = `OUT ${pin} ${state}`;
        if (val === 1) {
          set(ref(db, `users/${user}/In/In-${parts[1]}-${parts[2]}`), 1);
          btn.style.backgroundColor = "rgb(41, 63, 255)";
          btn.innerText = `ON ${pin}`;
        } else {
          set(ref(db, `users/${user}/In/In-${parts[1]}-${parts[2]}`), 0);
          btn.style.backgroundColor = "rgb(255, 152, 152)";
          btn.innerText = `OFF ${pin}`;
        }
      }
    });
  });
  // update dữ liệu cho card cảm biến
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
      if (charts[cardId] === undefined) return;
      charts[cardId].data.labels.push(time);
      if (parts[2] == "CB1") {
        document.getElementById(`channel1-${cardId}-CB1`).value = val;
      } else if (parts[2] == "CB2") {
        document.getElementById(`channel2-${cardId}-CB2`).value = val;
      } else if (parts[2] == "Warnled") {
        const stt = document.getElementById(`Warnled-${cardId}`);
        const state = val === 1 ? "Đang bật" : "Đang tắt";
        stt.innerText = `${state}`;
      } else if (parts[2] == "1") {
        const cb1 = document.getElementById(`value1-${cardId}`);
        cb1.innerText = val;
        charts[cardId].data.datasets[0].data.push(val);
      } else {
        const cb2 = document.getElementById(`value2-${cardId}`);
        cb2.innerText = val;
        charts[cardId].data.datasets[1].data.push(val);
      }
      charts[cardId].update("none");
    });
  });
}

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
// update dữ liệu ngưỡng
document.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const parts = btn.id.split("-");
  const cardId = parts[1];
  if (parts[0] != "Warnbtn") {
    return;
  } else {
    let value1 = document.getElementById(`channel1-${cardId}-CB1`);
    let value2 = document.getElementById(`channel2-${cardId}-CB2`);

    if (value2 == null) {
      value1 = Number(value1.value);
      set(ref(db, `users/${user}/Card/Data-${cardId}-CB1`), value1);
      alert(
        `
      Bạn đã cài đặt thành công ngưỡng cho card ${cardId}:
      Giá trị ngưỡng: ${value1}
      `,
      );
    } else {
      value1 = Number(value1.value);
      value2 = Number(value2.value);
      set(ref(db, `users/${user}/Card/Data-${cardId}-CB1`), value1);
      set(ref(db, `users/${user}/Card/Data-${cardId}-CB2`), value2);
      alert(
        `
      Bạn đã cài đặt thành công ngưỡng cho card ${cardId}:
      giá trị ngưỡng 1: ${value1}
      giá trị ngưỡng 2: ${value2}
      `,
      );
    }
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
  let text = "Bạn có muốn đăng xuất ?";
  if (confirm(text) == true) {
    localStorage.removeItem("cards");
    let user = localStorage.getItem("username");
    user = "";
    localStorage.setItem("username", user);
    window.location.href = "index.html";
  } else {
    return;
  }
};
document.getElementById("chat").onclick = function () {
  document.querySelector(".chat").style.display = "block";
};
document.getElementById("closeChat").onclick = function () {
  document.querySelector(".chat").style.display = "none";
};
function updateChatip() {
  const cards = JSON.parse(localStorage.getItem("cards")) || [];
  cards.forEach((card) => {
    let kenh;
    const box = document.createElement("div");
    box.className = "msg tip";
    if (card.type == "Sensor") {
      if (card.label2 == "") {
        kenh = "1";
      } else {
        kenh = "2";
      }
    } else {
      if (card.pin2 == null) {
        kenh = "1";
      } else {
        kenh = "2";
      }
    }
    box.innerHTML = `
      <button class="tip-btn" id="tipchat-${card.id}">
        <i class="fa-solid fa-lightbulb hint-icon"></i>
        Hướng dẫn sử dụng card ${card.id}
        <span class="txthint hint-text-${card.id}" style="display: none;">
          Tôi muốn bạn hướng dẫn sử dụng card ${card.type} 
          có id là ${card.id} 
          có ${kenh} kênh
        </span>
      </button>
    `;
    document.querySelector(".chat-tip").appendChild(box);
  });
}
document.addEventListener("click", function (e) {
  const btn = e.target.closest(".tip-btn");
  if (!btn) return;
  const msgu = btn.querySelector("span").innerText;
  let box = document.createElement("div");
  box.className = "msg user";
  box.innerText = `${msgu}
  `;
  document.querySelector("#chatBody").appendChild(box);
  chat(msgu);
});
document.getElementById("sendChat").onclick = function () {
  const msgu = document.querySelector("#chatInput").value;
  let box = document.createElement("div");
  box.className = "msg user";
  box.innerText = `${msgu}
  `;
  document.querySelector("#chatBody").appendChild(box);
  document.querySelector("#chatInput").value = "";
  if (msgu.includes("id") && msgu.includes("card") && msgu.includes("kênh")) {
    chat(msgu);
  } else {
    chatNor(msgu);
  }
};
document.getElementById("menu").onclick = function () {
  document.querySelector(".list").style.display = "block";
};
document.getElementById("closeMenu").onclick = function () {
  document.querySelector(".list").style.display = "none";
};
document.addEventListener("change", function (e) {
  const parts = e.target.id.split("-");
  if (parts[0] === "SW" || parts[0] === "channel1" || parts[0] === "channel2")
    return;
  if (e.target.id === "-1") {
    if (e.target.checked) {
      document.querySelector(".flow").style.display = "flex";
    } else {
      document.querySelector(".flow").style.display = "none";
    }
  } else if (e.target.id === "1") {
    if (e.target.checked) {
      document.querySelector(".box1").style.display = "flex";
    } else {
      document.querySelector(".box1").style.display = "none";
    }
  } else if (e.target.id === "2") {
    if (e.target.checked) {
      document.querySelector(".box2").style.display = "flex";
    } else {
      document.querySelector(".box2").style.display = "none";
    }
  } else if (e.target.id === "3") {
    if (e.target.checked) {
      document.querySelector(".box3").style.display = "flex";
    } else {
      document.querySelector(".box3").style.display = "none";
    }
  } else if (e.target.id === "0") {
    if (e.target.checked) {
      document.querySelector(".box0").style.display = "flex";
    } else {
      document.querySelector(".box0").style.display = "none";
    }
  } else if (parts[0] === "cb") {
    if (e.target.checked) {
      document.querySelector("." + parts[1] + parts[2]).style.display = "grid";
    } else {
      document.querySelector("." + parts[1] + parts[2]).style.display = "none";
    }
  } else {
    if (e.target.checked) {
      document.querySelector("." + parts[0] + parts[1]).style.display = "flex";
    } else {
      document.querySelector("." + parts[0] + parts[1]).style.display = "none";
    }
  }
});
