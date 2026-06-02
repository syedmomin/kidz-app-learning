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
