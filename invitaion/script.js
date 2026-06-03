/* Core invitation script: open invitation, countdown, reveal animations, and music. */

/* ── OPEN INVITATION ── */
function openInvitation() {
  playMusic();
  const splash = document.getElementById("splash");
  if (splash) splash.classList.add("gone");
  const main = document.getElementById("main-content");
  if (main) {
    main.style.opacity = "0";
    setTimeout(() => {
      main.style.opacity = "1";
    }, 100);
  }
  setTimeout(() => {
    document.querySelectorAll("#hero .reveal").forEach((el) => el.classList.add("visible"));
  }, 400);
}

/* ── COUNTDOWN ── */
const TARGET = new Date("2026-07-10T18:00:00");
function tick() {
  const now = new Date();
  const diff = TARGET - now;
  const cd = document.getElementById("countdown");
  if (!cd) return;
  if (diff <= 0) {
    cd.innerHTML = '<div class="cd-item"><span class="cd-num" style="font-size:1.4rem">🎊</span><span class="cd-lbl">Today!</span></div>';
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const setText = (id, v) => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(v).padStart(2, "0");
  };
  setText("cd-d", d);
  setText("cd-h", h);
  setText("cd-m", m);
  setText("cd-s", s);
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
  { threshold: 0.1 },
);
document.querySelectorAll(".reveal").forEach((el) => {
  if (!el.closest("#hero")) obs.observe(el);
});

/* ── MUSIC — plays on Open Invitation tap (user gesture) ── */
const audio = document.getElementById("audio");
if (audio) {
  audio.volume = 0.7;
  audio.loop = true;
  audio.preload = "auto";
}
function playMusic() {
  if (!audio) return;
  audio.muted = false;
  const p = audio.play();
  if (p && p.catch) {
    p.catch(() => {
      document.addEventListener(
        "click",
        () => {
          audio.play().catch(() => {});
        },
        { once: true },
      );
    });
  }
}

/* ── SCROLL PROGRESS BAR ── */
const progressBar = document.getElementById("scroll-progress");
function updateProgress() {
  if (!progressBar) return;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + "%";
}
window.addEventListener("scroll", updateProgress, { passive: true });

/* ── FALLING PETALS ── */
(function spawnPetals() {
  const container = document.getElementById("petals-container");
  if (!container) return;
  const colors = [
    "rgba(100,149,237,0.55)",
    "rgba(54,116,224,0.45)",
    "rgba(200,216,248,0.6)",
    "rgba(30,80,200,0.35)",
    "rgba(135,186,255,0.5)",
  ];
  const count = 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "petal";
    const leftPct = 2 + Math.random() * 96;
    const dur = 7 + Math.random() * 8;
    const delay = Math.random() * 12;
    const drift = (Math.random() - 0.5) * 120;
    const size = 8 + Math.random() * 8;
    const color = colors[Math.floor(Math.random() * colors.length)];
    p.style.cssText = `
      left:${leftPct}%;
      width:${size}px;
      height:${size * 1.3}px;
      background:${color};
      --dur:${dur}s;
      --delay:${delay}s;
      --drift:${drift}px;
      border-radius:${Math.random() > 0.5 ? "50% 0 50% 0" : "0 50% 0 50%"};
      transform:rotate(${Math.random() * 360}deg);
    `;
    container.appendChild(p);
  }
})();
