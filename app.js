let config;
let races = [];
let selectedRace;

let authToken = localStorage.getItem("authToken");

/* ---------------- AUTH ---------------- */

function login() {
  const token = document.getElementById("adminToken").value;

  if (!token) return alert("Enter token");

  localStorage.setItem("authToken", token);
  authToken = token;

  showApp();
}

function showApp() {
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("app").style.display = "block";
}

/* ---------------- API ---------------- */

function apiFetch(endpoint, body = {}) {
  return fetch(`${config.backendUrl}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": authToken
    },
    body: JSON.stringify(body)
  });
}

/* ---------------- LOAD ---------------- */

async function loadConfig() {
  config = await (await fetch("config.json")).json();
}

async function loadRaces() {
  const text = await (await fetch(config.calendarUrl)).text();
  races = parseICS(text);

  const select = document.getElementById("raceSelect");
  select.innerHTML = "";

  races.forEach((r, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `${r.summary} (${r.date.toLocaleString()})`;
    select.appendChild(opt);
  });

  select.onchange = () => {
    selectedRace = races[select.value];
    updateRaceStatus();
    loadResponses();
  };

  selectedRace = races[0];
}

/* ---------------- STATUS ---------------- */

function updateRaceStatus() {
  const now = new Date();
  const close = new Date(selectedRace.date.getTime() - config.pollCloseMinutes * 60000);

  const state = now > close ? "🔒 Closed" : "✅ Open";

  document.getElementById("raceStatus").innerHTML = `<b>Status:</b> ${state}`;
}

/* ---------------- RESPONSES ---------------- */

async function loadResponses() {
  try {
    const res = await fetch(`data/${selectedRace.summary}.json`);
    const data = await res.json();

    const tbody = document.getElementById("responses");
    tbody.innerHTML = "";

    data.responses.forEach(r => {
      const icon =
        r.late ? "⚠" :
        r.status === "yes" ? "✅" :
        r.status === "no" ? "❌" : "⏳";

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${r.boat || ""}</td>
        <td>${r.skipper || ""}</td>
        <td>${icon}</td>
        <td>${r.comment || ""}</td>
        <td>${r.timestamp || ""}</td>
      `;
      tbody.appendChild(row);
    });

  } catch (e) {
    console.log("No data yet");
  }

  loadAudit();
}

async function loadAudit() {
  try {
    const audit = await (await fetch("audit-log.json")).json();
    document.getElementById("audit").textContent =
      JSON.stringify(audit, null, 2);
  } catch {}
}

/* ---------------- ADMIN ACTIONS ---------------- */

async function sendPoll() {
  await apiFetch("/sendPoll", { race: selectedRace });
  alert("Poll sent");
}

async function forceClosePoll() {
  await apiFetch("/forceClose", { race: selectedRace });
  alert("Poll closed");
}

async function overrideResponse() {
  const phone = document.getElementById("overridePhone").value;
  const status = document.getElementById("overrideStatus").value;
  const comment = document.getElementById("overrideComment").value;

  await apiFetch("/override", {
    phone,
    status,
    comment,
    race: selectedRace
  });

  alert("Override applied");
}

/* ---------------- INIT ---------------- */

setInterval(loadResponses, 10000);

(async function init() {

  if (authToken) {
    showApp();
  }

  await loadConfig();
  await loadRaces();

  updateRaceStatus();
  loadResponses();

})();