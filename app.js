let config;
let races = [];
let selectedRace;

async function loadConfig() {
  config = await (await fetch('config.json')).json();
}

async function loadRaces() {
  const text = await (await fetch(config.calendarUrl)).text();
  races = parseICS(text);

  const select = document.getElementById("raceSelect");

  races.forEach((r, i) => {
    let opt = document.createElement("option");
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

function updateRaceStatus() {
  const now = new Date();
  const closeTime = new Date(selectedRace.date.getTime() - config.pollCloseMinutes * 60000);

  const status = now > closeTime ? "🔒 Closed" : "✅ Open";

  document.getElementById("raceStatus").innerHTML = `<b>Status:</b> ${status}`;
}

async function loadResponses() {
  const res = await fetch(`data/${selectedRace.summary}.json`);
  const data = await res.json();

  const tbody = document.getElementById("responses");
  tbody.innerHTML = "";

  data.responses.forEach(r => {
    const row = document.createElement("tr");

    let icon = "⏳";
    if (r.status === "yes") icon = "✅";
    if (r.status === "no") icon = "❌";
    if (r.late) icon = "⚠";

    row.innerHTML = `
      <td>${r.boat}</td>
      <td>${r.skipper}</td>
      <td>${icon}</td>
      <td>${r.comment || ''}</td>
      <td>${r.timestamp}</td>
    `;

    tbody.appendChild(row);
  });

  loadAudit();
}

async function loadAudit() {
  const audit = await (await fetch('audit-log.json')).json();
  document.getElementById("audit").textContent = JSON.stringify(audit, null, 2);
}

async function sendPoll() {
  await fetch(`${config.backendUrl}/sendPoll`, {
    method: "POST",
    body: JSON.stringify({ race: selectedRace })
  });
}

async function forceClosePoll() {
  await fetch(`${config.backendUrl}/forceClose`, {
    method: "POST",
    body: JSON.stringify({ race: selectedRace })
  });
}

async function overrideResponse() {
  const phone = document.getElementById("overridePhone").value;
  const status = document.getElementById("overrideStatus").value;
  const comment = document.getElementById("overrideComment").value;

  await fetch(`${config.backendUrl}/override`, {
    method: "POST",
    body: JSON.stringify({ phone, status, comment, race: selectedRace })
  });
}

setInterval(loadResponses, 10000);

(async function init() {
  await loadConfig();
  await loadRaces();
  updateRaceStatus();
  loadResponses();
})();
