/*
 * EFFECTS — satu sistem angin:
 *  - Daun berguguran di canvas (bentuk dari leaves.js), berputar dan membalik
 *  - Embusan angin berkala: --gust naik lalu reda, daun terbawa, spesimen
 *    bergoyang dan selotipnya terangkat (gaya di components.css)
 *  - Klik/tap: embusan dari titik itu + beberapa daun lepas
 *  - Gerakan mouse memberi angin kecil ke arah gerak
 *  - Tombol salin tautan + toast
 * Semua gerak mati untuk pengguna "kurangi animasi" dan saat tab tidak terlihat.
 */
(() => {
  const FX = { leaves: true, leafCount: 16, wind: true, ...window.PROFILE.effects };
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;
  const $ = (sel) => document.querySelector(sel);
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // ---------- Toast & salin tautan ----------
  let toastTimer;
  function toast(text) {
    const node = $("#toast");
    node.textContent = text;
    node.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove("is-show"), 2200);
  }

  $("#copy").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      toast("Tautan disalin");
    } catch {
      toast("Gagal menyalin, salin dari address bar");
    }
  });

  if (reduceMotion) return;

  // ---------- Angin ----------
  // gust: kekuatan embusan 0..1 (dipakai CSS), wind: dorongan horizontal untuk daun
  const air = { gust: 0, target: 0, wind: 0.4, push: 0 };

  function blow(strength = 1) {
    air.target = Math.min(1, strength);
    air.push = (Math.random() < 0.5 ? -1 : 1) * strength * 3;
  }

  function scheduleGust() {
    setTimeout(() => {
      if (!document.hidden) blow(rand(0.55, 1));
      scheduleGust();
    }, rand(5000, 9000));
  }
  if (FX.wind) scheduleGust();

  // ---------- Canvas daun ----------
  const canvas = $("#fall");
  const ctx = canvas.getContext("2d");
  const css = getComputedStyle(root);
  const colors = ["--maple", "--rust", "--ochre", "--moss"].map((v) => css.getPropertyValue(v).trim());
  const shapes = window.Leaves.KINDS.map((k) => ({ blade: new Path2D(window.Leaves.blade(k)), veins: new Path2D(window.Leaves.veins(k)) }));
  let w, h, dpr;
  const leaves = [];

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
  }

  function leaf(x, y, loose = false) {
    return {
      x, y,
      size: rand(0.13, 0.26) * dpr,     // skala dari bentuk 100 unit
      shape: pick(shapes),
      color: pick(colors),
      rot: rand(0, Math.PI * 2),
      spin: rand(-0.025, 0.025),
      flip: rand(0, Math.PI * 2),
      flipSpeed: rand(0.015, 0.045),
      sway: rand(0, Math.PI * 2),
      fall: rand(0.45, 1.1) * dpr,
      vx: loose ? rand(-4, 4) * dpr : 0,
      vy: loose ? rand(-5, -1) * dpr : 0
    };
  }

  function recycle(l) {
    Object.assign(l, leaf(rand(-0.1 * w, w), rand(-80, -20) * dpr));
  }

  function step(l) {
    l.sway += 0.02;
    l.flip += l.flipSpeed * (1 + air.gust * 2);
    l.rot += l.spin + air.wind * 0.004;
    l.vx *= 0.97;
    l.vy = l.vy * 0.95;
    l.x += (Math.sin(l.sway) * 0.8 + air.wind * 2.2) * dpr + l.vx;
    l.y += l.fall * (1 - air.gust * 0.4) + l.vy;
    return l.y < h + 60 * dpr && l.x > -80 * dpr && l.x < w + 80 * dpr;
  }

  function draw(l) {
    ctx.save();
    ctx.translate(l.x, l.y);
    ctx.rotate(l.rot);
    ctx.scale(l.size * Math.cos(l.flip), l.size); // membalik seperti 3D
    ctx.fillStyle = l.color;
    ctx.globalAlpha = 0.9;
    ctx.fill(l.shape.blade);
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = "#2b2118";
    ctx.lineWidth = 1.4 / l.size;
    ctx.stroke(l.shape.veins);
    ctx.restore();
  }

  let running = true;
  let lastGust = -1;
  function frame() {
    if (!running) return;
    // embusan naik cepat lalu reda pelan
    air.gust += (air.target - air.gust) * (air.target > air.gust ? 0.08 : 0.02);
    air.target *= 0.985;
    air.push *= 0.97;
    air.wind += (0.4 + air.push - air.wind) * 0.04;

    if (Math.abs(air.gust - lastGust) > 0.003) {
      root.style.setProperty("--gust", air.gust.toFixed(3));
      lastGust = air.gust;
    }

    ctx.clearRect(0, 0, w, h);
    for (let i = leaves.length - 1; i >= 0; i--) {
      const l = leaves[i];
      if (!step(l)) {
        if (l.loose) leaves.splice(i, 1);
        else recycle(l);
        continue;
      }
      draw(l);
    }
    requestAnimationFrame(frame);
  }

  resize();
  addEventListener("resize", resize);
  if (FX.leaves) for (let i = 0; i < FX.leafCount; i++) leaves.push(leaf(rand(0, w), rand(-h, h)));

  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) frame();
  });
  frame();

  // ---------- Interaksi ----------
  let lastX = null;
  addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    if (lastX !== null) air.push += (e.clientX - lastX) * 0.004;
    lastX = e.clientX;
  });

  // Klik/tap: embusan dari titik itu, daun di dekatnya terdorong, 4 daun baru lepas
  addEventListener("pointerdown", (e) => {
    const x = e.clientX * dpr, y = e.clientY * dpr;
    blow(0.8);
    for (const l of leaves) {
      const dx = l.x - x, dy = l.y - y;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist < 260 * dpr) {
        const f = (1 - dist / (260 * dpr)) * 9 * dpr;
        l.vx += (dx / dist) * f;
        l.vy += (dy / dist) * f;
      }
    }
    if (FX.leaves) for (let i = 0; i < 4; i++) leaves.push(Object.assign(leaf(x, y, true), { loose: true }));
  });
})();
