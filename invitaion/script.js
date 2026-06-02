/* ════════════════════════════════════════
   GUEST DATABASE — personalized greetings
   Each guest has a unique slug (URL key)
   Link format: aunikaahinvite.netlify.app/?g=SLUG
   ════════════════════════════════════════ */
const GUESTS = {
  // Families
  qazifamily: {
    greeting: "Dear Qazi Family",
    name: "Qazi Family",
    maxPax: 8,
    type: "Family",
  },
  pervez: {
    greeting: "Dear Pervez Family",
    name: "Pervez Family",
    maxPax: 7,
    type: "Family",
  },
  junaidchacha: {
    greeting: "Dear Junaid Chacha & Family",
    name: "Junaid Chacha",
    maxPax: 6,
    type: "Family",
  },
  rafat: {
    greeting: "Dear Rafat Family",
    name: "Rafat Family",
    maxPax: 6,
    type: "Family",
  },

  // Mr & Mrs
  shahid: {
    greeting: "Dear Mr. & Mrs. Shahid",
    name: "Mr. & Mrs. Shahid",
    maxPax: 2,
    type: "Mr & Mrs",
  },
  hamid: {
    greeting: "Dear Mr. & Mrs. Hamid",
    name: "Mr. & Mrs. Hamid",
    maxPax: 2,
    type: "Mr & Mrs",
  },
  shakeel: {
    greeting: "Dear Mr. & Mrs. Shakeel",
    name: "Mr. & Mrs. Shakeel",
    maxPax: 2,
    type: "Mr & Mrs",
  },
  nadeemqazi: {
    greeting: "Dear Mr. & Mrs. Nadeem Qazi",
    name: "Mr. & Mrs. Nadeem Qazi",
    maxPax: 2,
    type: "Mr & Mrs",
  },
  paracha: {
    greeting: "Dear Mr. & Mrs. Paracha",
    name: "Mr. & Mrs. Paracha",
    maxPax: 2,
    type: "Mr & Mrs",
  },
  saahir: {
    greeting: "Dear Mr. & Mrs. Saahir",
    name: "Mr. & Mrs. Saahir",
    maxPax: 2,
    type: "Mr & Mrs",
  },
  sohail: {
    greeting: "Dear Mr. & Mrs. Sohail",
    name: "Mr. & Mrs. Sohail",
    maxPax: 2,
    type: "Mr & Mrs",
  },
  younes: {
    greeting: "Dear Mr. & Mrs. Younes",
    name: "Mr. & Mrs. Younes",
    maxPax: 2,
    type: "Mr & Mrs",
  },
  irfan: {
    greeting: "Dear Mr. & Mrs. Irfan",
    name: "Mr. & Mrs. Irfan",
    maxPax: 2,
    type: "Mr & Mrs",
  },

  // Single - special honorifics
  khaalajaani: {
    greeting: "Dear Khaala Jaani",
    name: "Khaala Jaani",
    maxPax: 1,
    type: "Single",
  },
  moulanawaseem: {
    greeting: "Respected Moulana Waseem",
    name: "Moulana Waseem",
    maxPax: 1,
    type: "Single",
  },

  // Single - Mr.
  mohib: {
    greeting: "Dear Mr. Mohib",
    name: "Mr. Mohib",
    maxPax: 1,
    type: "Single",
  },
  yasir: {
    greeting: "Dear Mr. Yasir",
    name: "Mr. Yasir",
    maxPax: 1,
    type: "Single",
  },
  naveed: {
    greeting: "Dear Mr. Naveed",
    name: "Mr. Naveed",
    maxPax: 1,
    type: "Single",
  },
  anwer: {
    greeting: "Dear Mr. Anwer",
    name: "Mr. Anwer",
    maxPax: 1,
    type: "Single",
  },
  rohan: {
    greeting: "Dear Mr. Rohan",
    name: "Mr. Rohan",
    maxPax: 1,
    type: "Single",
  },
  huzaifa: {
    greeting: "Dear Mr. Huzaifa",
    name: "Mr. Huzaifa",
    maxPax: 1,
    type: "Single",
  },
  hamza: {
    greeting: "Dear Mr. Hamza",
    name: "Mr. Hamza",
    maxPax: 1,
    type: "Single",
  },
  humza: {
    greeting: "Dear Mr. Humza",
    name: "Mr. Humza",
    maxPax: 1,
    type: "Single",
  },
  khizar: {
    greeting: "Dear Mr. Khizar",
    name: "Mr. Khizar",
    maxPax: 1,
    type: "Single",
  },
  ebbad: {
    greeting: "Dear Mr. Ebbad",
    name: "Mr. Ebbad",
    maxPax: 1,
    type: "Single",
  },
  usamayousef: {
    greeting: "Dear Mr. Usama Yousef",
    name: "Mr. Usama Yousef",
    maxPax: 1,
    type: "Single",
  },
  usamaasad: {
    greeting: "Dear Mr. Usama Asad",
    name: "Mr. Usama Asad",
    maxPax: 1,
    type: "Single",
  },
  sami: {
    greeting: "Dear Mr. Sami",
    name: "Mr. Sami",
    maxPax: 1,
    type: "Single",
  },
  nidal: {
    greeting: "Dear Mr. Nidal",
    name: "Mr. Nidal",
    maxPax: 1,
    type: "Single",
  },
  isa: {
    greeting: "Dear Mr. Isa",
    name: "Mr. Isa",
    maxPax: 1,
    type: "Single",
  },
  luqman: {
    greeting: "Dear Mr. Luqman",
    name: "Mr. Luqman",
    maxPax: 1,
    type: "Single",
  },
  chappati: {
    greeting: "Dear Mr. Chappati",
    name: "Mr. Chappati",
    maxPax: 1,
    type: "Single",
  },
  ahmedrefaie: {
    greeting: "Dear Mr. Ahmed Refaie",
    name: "Mr. Ahmed Refaie",
    maxPax: 1,
    type: "Single",
  },
  teo: {
    greeting: "Dear Mr. Teo",
    name: "Mr. Teo",
    maxPax: 1,
    type: "Single",
  },
  rafayhamid: {
    greeting: "Dear Mr. Rafay Hamid",
    name: "Mr. Rafay Hamid",
    maxPax: 1,
    type: "Single",
  },
  rafaykhokhar: {
    greeting: "Dear Mr. Rafay Khokhar",
    name: "Mr. Rafay Khokhar",
    maxPax: 1,
    type: "Single",
  },
  taimoor: {
    greeting: "Dear Mr. Taimoor",
    name: "Mr. Taimoor",
    maxPax: 1,
    type: "Single",
  },
  razaarsla: {
    greeting: "Dear my beloved Raza bhai and Arsla aapi",
    name: "Raza Mahmood & Arsla Raza",
    maxPax: 5,
    type: "Mr & Mrs",
  },
};

/* Resolve guest from URL ?g=slug */
function getCurrentGuest() {
  const params = new URLSearchParams(window.location.search);
  const slug = (params.get("g") || "").toLowerCase().trim();
  if (slug && GUESTS[slug])
    return {
      slug,
      ...GUESTS[slug],
    };
  return null;
}

const currentGuest = getCurrentGuest();

/* Apply personalization once DOM is ready */
function applyPersonalization() {
  if (!currentGuest) return;

  // Splash invited line
  const invitedEl = document.querySelector(".splash-you-are-invited");
  if (invitedEl) {
    invitedEl.innerHTML = `${currentGuest.greeting},<br>You Are Invited To The Nikaah of`;
  }

  // Pre-fill the name field with the guest's known label
  const nameInput = document.getElementById("f-name");
  if (nameInput) {
    nameInput.value = currentGuest.name;
  }

  // Constrain the pax dropdown to maxPax
  const paxSelect = document.getElementById("f-pax");
  if (paxSelect) {
    paxSelect.innerHTML = '<option value="">— Select —</option>';
    for (let i = 1; i <= currentGuest.maxPax; i++) {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = i;
      paxSelect.appendChild(opt);
    }
    // If single-guest, auto-select 1 and hide the field
    if (currentGuest.maxPax === 1) {
      paxSelect.value = "1";
      const paxGroup = document.getElementById("pax-group");
      if (paxGroup) paxGroup.style.display = "none";
    }
  }
}
document.addEventListener("DOMContentLoaded", applyPersonalization);

/* ════════════════════════════════════════
   GOOGLE SHEETS WEB APP ENDPOINT
   Set this to the URL you receive after deploying
   your Google Apps Script (see setup instructions)
   ════════════════════════════════════════ */
const SHEETS_WEBAPP_URL = "";
// ← paste your Apps Script Web App URL here

function postToSheet(payload) {
  if (!SHEETS_WEBAPP_URL) return;
  // silently skip if not configured yet
  // Use no-cors mode so the request fires even without a custom backend
  fetch(SHEETS_WEBAPP_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(payload),
  }).catch(() => {
    /* fail silently — localStorage still has it */
  });
}

/* ── OPEN INVITATION ── */
function openInvitation() {
  playMusic();
  document.getElementById("splash").classList.add("gone");
  const main = document.getElementById("main-content");
  main.style.opacity = "0";
  setTimeout(() => {
    main.style.opacity = "1";
  }, 100);
  setTimeout(() => {
    document
      .querySelectorAll("#hero .reveal")
      .forEach((el) => el.classList.add("visible"));
  }, 400);
}

/* ── COUNTDOWN ── */
const TARGET = new Date("2026-07-10T18:00:00");
function tick() {
  const now = new Date();
  const diff = TARGET - now;
  if (diff <= 0) {
    document.getElementById("countdown").innerHTML =
      '<div class="cd-item"><span class="cd-num" style="font-size:1.4rem">🎊</span><span class="cd-lbl">Today!</span></div>';
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  document.getElementById("cd-d").textContent = String(d).padStart(2, "0");
  document.getElementById("cd-h").textContent = String(h).padStart(2, "0");
  document.getElementById("cd-m").textContent = String(m).padStart(2, "0");
  document.getElementById("cd-s").textContent = String(s).padStart(2, "0");
}
tick();
setInterval(tick, 1000);

/* ── SCROLL REVEAL ── */
const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        obs.unobserve(e.target);
      }
    });
  },
  {
    threshold: 0.1,
  },
);
document.querySelectorAll(".reveal").forEach((el) => {
  if (!el.closest("#hero")) obs.observe(el);
});

/* ── RADIO PILLS ── */
document.querySelectorAll(".radio-pill input[type=radio]").forEach((r) => {
  r.addEventListener("change", () => {
    document
      .querySelectorAll(".radio-pill")
      .forEach((p) => p.classList.remove("selected"));
    r.closest(".radio-pill").classList.add("selected");
  });
});

/* ── RSVP ── */
const STORE_KEY = "nikaah_rsvp_azeem_unzila";
function getAll() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || [];
  } catch {
    return [];
  }
}
function saveOne(e) {
  const a = getAll();
  a.push(e);
  localStorage.setItem(STORE_KEY, JSON.stringify(a));
}

function submitRSVP() {
  const deadline = new Date("2026-06-30T23:59:59");
  if (new Date() > deadline) {
    alert(
      "The RSVP deadline of 30th June 2026 has passed. JazakAllah Khair for your interest.",
    );
    return;
  }
  const name = document.getElementById("f-name").value.trim();
  const attendEl = document.querySelector("input[name=attendance]:checked");
  const pax = document.getElementById("f-pax").value;
  let ok = true;

  const eN = document.getElementById("e-name"),
    fN = document.getElementById("f-name");
  if (!name) {
    fN.classList.add("invalid");
    eN.classList.add("show");
    ok = false;
  } else {
    fN.classList.remove("invalid");
    eN.classList.remove("show");
  }

  const eA = document.getElementById("e-attend");
  if (!attendEl) {
    eA.classList.add("show");
    ok = false;
  } else {
    eA.classList.remove("show");
  }

  const eP = document.getElementById("e-pax"),
    fP = document.getElementById("f-pax");
  if (attendEl && attendEl.value === "Attending" && !pax) {
    fP.classList.add("invalid");
    eP.classList.add("show");
    ok = false;
  } else {
    fP.classList.remove("invalid");
    eP.classList.remove("show");
  }

  if (!ok) return;

  const entry = {
    id: Date.now(),
    name,
    attendance: attendEl.value,
    pax: attendEl.value === "Attending" ? pax : "–",
    ts: new Date().toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
    slug: currentGuest ? currentGuest.slug : "(direct visit)",
    expectedName: currentGuest ? currentGuest.name : "",
  };
  saveOne(entry);
  postToSheet(entry);

  document.getElementById("rsvp-form-area").style.display = "none";
  document.getElementById("thankyou").style.display = "block";
  if (attendEl.value === "Declining") {
    document.getElementById("ty-msg").innerHTML =
      'We understand and appreciate you letting us know.<br><span class="ty-gold">May Allah bless you always.</span>';
  }
}

/* ── ADMIN ── */
const ADMIN_PASSCODE = "0715";
let adminUnlocked = false;

function toggleAdmin() {
  const p = document.getElementById("admin-panel");
  // If panel is already open, just close it
  if (p.classList.contains("open")) {
    p.classList.remove("open");
    return;
  }
  // Require passcode before opening
  if (!adminUnlocked) {
    const entry = prompt("Enter admin passcode:");
    if (entry === null) return;
    // user cancelled
    if (entry.trim() !== ADMIN_PASSCODE) {
      alert("Incorrect passcode.");
      return;
    }
    adminUnlocked = true;
    // unlocked for this session
  }
  p.classList.add("open");
  renderAdmin();
}
function renderAdmin() {
  const data = getAll();
  const attending = data.filter((r) => r.attendance === "Attending");
  const declining = data.filter((r) => r.attendance === "Declining");
  const pax = attending.reduce((s, r) => s + (parseInt(r.pax) || 0), 0);

  document.getElementById("admin-stats").innerHTML = `
    <div class="stat-card"><span class="s-num">${data.length}</span><span class="s-lbl">Total RSVPs</span></div>
    <div class="stat-card"><span class="s-num">${attending.length}</span><span class="s-lbl">Attending</span></div>
    <div class="stat-card"><span class="s-num">${declining.length}</span><span class="s-lbl">Declining</span></div>
    <div class="stat-card"><span class="s-num">${pax}</span><span class="s-lbl">Total Pax</span></div>
  `;
  if (!data.length) {
    document.getElementById("admin-table-wrap").innerHTML =
      '<p style="text-align:center;color:#aaa;padding:32px 0;font-size:.85rem;">No RSVPs yet.</p>';
    return;
  }

  // Attending guest list
  const attendRows = attending
    .slice()
    .reverse()
    .map(
      (r, i) => `
    <tr>
      <td style="color:#bbb;font-size:.75rem;width:24px">${attending.length - i}</td>
      <td><strong>${r.name}</strong></td>
      <td>${r.pax}</td>
      <td style="color:#bbb;font-size:.75rem">${r.ts}</td>
    </tr>`,
    )
    .join("");

  // Declining guest list
  const declineRows = declining
    .slice()
    .reverse()
    .map(
      (r, i) => `
    <tr>
      <td style="color:#bbb;font-size:.75rem;width:24px">${declining.length - i}</td>
      <td><strong>${r.name}</strong></td>
      <td style="color:#bbb;font-size:.75rem">${r.ts}</td>
    </tr>`,
    )
    .join("");

  document.getElementById("admin-table-wrap").innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0 12px;">
      <h3 style="font-family:var(--serif);font-style:italic;color:var(--teal);font-size:1.2rem;margin:0;">Guest List</h3>
      <button onclick="exportCSV()" style="background:var(--gold);color:#fff;border:none;border-radius:8px;padding:6px 14px;font-family:var(--sans);font-size:.72rem;font-weight:600;cursor:pointer;letter-spacing:.3px;">⬇ Export CSV</button>
    </div>

    <p style="font-size:.72rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--teal);margin:16px 0 6px;">✓ Attending (${attending.length})</p>
    ${
      attending.length
        ? `<div style="overflow-x:auto"><table id="rsvp-table">
      <thead><tr><th>#</th><th>Name</th><th>Pax</th><th>Submitted</th></tr></thead>
      <tbody>${attendRows}</tbody>
    </table></div>`
        : '<p style="color:#bbb;font-size:.8rem;padding:6px 0;">None yet.</p>'
    }

    <p style="font-size:.72rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--pink-deep);margin:22px 0 6px;">✕ Declining (${declining.length})</p>
    ${
      declining.length
        ? `<div style="overflow-x:auto"><table id="rsvp-table">
      <thead><tr><th>#</th><th>Name</th><th>Submitted</th></tr></thead>
      <tbody>${declineRows}</tbody>
    </table></div>`
        : '<p style="color:#bbb;font-size:.8rem;padding:6px 0;">None yet.</p>'
    }
  `;
}

/* ── EXPORT CSV ── */
function exportCSV() {
  const data = getAll();
  if (!data.length) {
    alert("No RSVPs to export yet.");
    return;
  }
  let csv = "Name,Status,Pax,Submitted\n";
  data.forEach((r) => {
    const name = '"' + String(r.name).replace(/"/g, '""') + '"';
    csv += `${name},${r.attendance},${r.pax},"${r.ts}"\n`;
  });
  const blob = new Blob([csv], {
    type: "text/csv",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "nikaah-rsvps.csv";
  a.click();
  URL.revokeObjectURL(url);
}

/* ── MUSIC — plays on Open Invitation tap (guaranteed user gesture) ── */
const audio = document.getElementById("audio");
audio.volume = 0.7;
audio.loop = true;
audio.preload = "auto";
function playMusic() {
  audio.muted = false;
  const p = audio.play();
  if (p && p.catch) {
    p.catch((err) => {
      console.log("Audio play failed:", err);
      // Retry once on any subsequent tap
      document.addEventListener(
        "click",
        () => {
          audio.play().catch(() => {});
        },
        {
          once: true,
        },
      );
    });
  }
}
