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
  if (live) {
    mixedChart2.resetZoom();
  }
  console.log(live);
  mixedChart2.update();
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
var count = 0;
document.getElementById("addblock").onclick = function () {
  let box = document.createElement("div");
  count += 1;
  box.className = "box box5";
  box.innerHTML = `
    <h2>Thêm card mới</h2>
    <form>
      <input type="text" placeholder="Nhập tên card" id = "cardName"><br>
      <label>Lựa chọn loại card</label>
      <select id="cardType">
        <option value="Cảm biến">Cảm biến</option>
        <option value="Điều khiển In Out">Điều khiển In Out</option>
      </select><br>
      <label>Lựa chọn loại biểu đồ</label>
      <select id="chartType">
        <option value="line">Biểu đồ đường</option>
        <option value="bar">Biểu đồ cột</option>
        <option value="pie">Biểu đồ tròn</option>
        <option value="doughnut">Biểu đồ vòng</option>
        <option value="mixchart">Biểu đồ hỗn hợp</option>
        <option value="none">Không</option>
      </select><br>
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
      </select><br>
      <button type="button" id="getInfor">Xác nhận</button>
    </form>
  `;
  document.querySelector(".container").appendChild(box);
  box.querySelector("#getInfor").onclick = function () {
    const selectChart = box.querySelector("#chartType").value;
    const selectCard = box.querySelector("#cardType").value;
    const selectPin = box.querySelector("#selectPin").value;
    const cardName = box.querySelector("#cardName").value;
    alert(
      `Bạn đã chọn:
      Biểu đồ: ${selectChart}
      Card: ${selectCard}
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
      const mixedChart1 = new Chart(ctxNew, {
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
          },
        },
      });
    }
  };
};
document.getElementById("chatbot").onclick = function () {
  alert("Tính năng Chat Bot AI đang được phát triển!");
};
let live = false;
document.getElementById("live").onclick = function () {
  live = !live;
  const ele = document.getElementById("live");

  const zoomOpt = mixedChart2.options.plugins.zoom;

  if (live) {
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
