/*
 * EFFECTS — semua animasi interaktif. Tiap efek = satu fungsi setup*,
 * dinyalakan di init() paling bawah sesuai PROFILE.effects.
 *
 *  - Loader pembuka
 *  - Canvas: daun berguguran (berputar & membalik 3D, tertiup angin
 *    dari gerakan mouse), ledakan daun saat klik, kunang-kunang,
 *    jejak percikan kursor
 *  - Parallax bukit (mouse + scroll)
 *  - Tilt 3D + sorotan cahaya di kartu link
 *  - Riak saat klik kartu, kartu "tertiup" saat klik latar
 *  - Badai daun: klik dua kali avatar
 *  - Tombol bagikan (Web Share / salin link + toast)
 */
(() => {
  const FX = { leaves: true, leafCount: 38, cursorTrail: true, tilt: true, fireflies: true, loader: true, ...window.PROFILE.effects };
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const $ = (sel) => document.querySelector(sel);
  const rand = (min, max) => min + Math.random() * (max - min);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const LEAF_COLORS = ["#d9481c", "#f07f2a", "#f5b041", "#ffd27a", "#8e2f14", "#c2501f", "#e8a33d"];

  // Posisi & kecepatan mouse, dipakai angin, parallax, dan jejak
  const mouse = { x: innerWidth / 2, y: innerHeight / 2, vx: 0, active: false };

  // ---------- Toast ----------
  let toastTimer;
  function toast(message) {
    const node = $("#toast");
    node.textContent = message;
    node.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove("is-show"), 2200);
  }

  // ---------- Loader ----------
  function setupLoader() {
    const loader = $("#loader");
    if (!FX.loader || reduceMotion) return loader.remove();
    // tampil minimal 900ms supaya animasinya sempat terlihat
    const minTime = new Promise((r) => setTimeout(r, 900));
    const loaded = new Promise((r) => (document.readyState === "complete" ? r() : addEventListener("load", r)));
    Promise.all([minTime, loaded]).then(() => {
      loader.classList.add("is-done");
      setTimeout(() => loader.remove(), 800);
    });
  }

  // ---------- Canvas: daun, kunang-kunang, percikan ----------
  function setupCanvas() {
    const canvas = $("#fx");
    const ctx = canvas.getContext("2d");
    let w, h, dpr;
    let wind = 0;

    const leaves = [];
    const fireflies = [];
    const sparks = [];

    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.width = innerWidth * dpr;
      h = canvas.height = innerHeight * dpr;
      canvas.style.width = innerWidth + "px";
      canvas.style.height = innerHeight + "px";
    }

    function makeLeaf(x, y, burst = false) {
      const angle = rand(0, Math.PI * 2);
      const speed = burst ? rand(3, 9) : 0;
      return {
        x: x ?? rand(0, w),
        y: y ?? rand(-h, 0),
        size: rand(9, 20) * dpr,
        color: pick(LEAF_COLORS),
        maple: Math.random() < 0.55,          // bentuk maple atau daun lonjong
        rot: rand(0, Math.PI * 2),
        spin: rand(-0.04, 0.04),
        flip: rand(0, Math.PI * 2),           // membalik seperti 3D
        flipSpeed: rand(0.02, 0.06),
        sway: rand(0, Math.PI * 2),
        swaySpeed: rand(0.01, 0.03),
        fall: rand(0.6, 1.6) * dpr,
        vx: Math.cos(angle) * speed * dpr,
        vy: Math.sin(angle) * speed * dpr - (burst ? 3 * dpr : 0),
        life: burst ? 1 : -1                  // -1 = daun abadi (didaur ulang), burst memudar
      };
    }

    // Bentuk daun maple dari kurva polar (5 lobus)
    function drawMaple(s) {
      ctx.beginPath();
      for (let i = 0; i <= 60; i++) {
        const t = (i / 60) * Math.PI * 2;
        const r = s * (0.55 + 0.45 * Math.abs(Math.sin(2.5 * t)) ** 0.6) * (t > Math.PI * 0.85 && t < Math.PI * 1.15 ? 0.35 : 1);
        const x = r * Math.sin(t);
        const y = -r * Math.cos(t);
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    }

    function drawOval(s) {
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.7, -s * 0.5, s * 0.6, s * 0.5, 0, s);
      ctx.bezierCurveTo(-s * 0.6, s * 0.5, -s * 0.7, -s * 0.5, 0, -s);
      ctx.fill();
    }

    function drawLeaf(l) {
      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.rot);
      ctx.scale(Math.cos(l.flip), 1); // efek membalik
      ctx.globalAlpha = l.life >= 0 ? Math.max(l.life, 0) : 0.92;
      ctx.fillStyle = l.color;
      l.maple ? drawMaple(l.size) : drawOval(l.size);
      // tulang daun
      ctx.strokeStyle = "rgba(60, 25, 10, 0.45)";
      ctx.lineWidth = Math.max(1, l.size * 0.07);
      ctx.beginPath();
      ctx.moveTo(0, -l.size * 0.8);
      ctx.lineTo(0, l.size * 1.15);
      ctx.stroke();
      ctx.restore();
    }

    function updateLeaf(l) {
      l.sway += l.swaySpeed;
      l.flip += l.flipSpeed;
      l.rot += l.spin + wind * 0.002;
      l.vx *= 0.96;
      l.vy = l.vy * 0.96 + (l.life >= 0 ? 0.12 * dpr : 0);
      l.x += Math.sin(l.sway) * 0.9 * dpr + wind * dpr + l.vx;
      l.y += l.fall + l.vy;
      if (l.life >= 0) l.life -= 0.006;

      // daun abadi didaur ulang ke atas saat keluar layar
      if (l.life < 0 && l.life !== -1) return false;
      if (l.life === -1 && (l.y > h + 40 || l.x < -60 || l.x > w + 60)) {
        Object.assign(l, makeLeaf(rand(0, w), -30));
      }
      return l.life === -1 || l.life > 0;
    }

    function makeFirefly() {
      return { x: rand(0, w), y: rand(h * 0.35, h), r: rand(1.2, 2.6) * dpr, phase: rand(0, Math.PI * 2), dx: rand(-0.3, 0.3), dy: rand(-0.25, 0.1) };
    }

    function drawFirefly(f) {
      f.phase += 0.03;
      f.x += f.dx * dpr + Math.sin(f.phase) * 0.3;
      f.y += f.dy * dpr + Math.cos(f.phase * 0.7) * 0.3;
      if (f.y < h * 0.2 || f.x < 0 || f.x > w) Object.assign(f, makeFirefly(), { y: h });
      const glow = (Math.sin(f.phase * 2) + 1) / 2;
      const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 6);
      g.addColorStop(0, `rgba(255, 230, 150, ${0.9 * glow})`);
      g.addColorStop(1, "rgba(255, 180, 80, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r * 6, 0, Math.PI * 2);
      ctx.fill();
    }

    function addSparks(x, y, n = 2) {
      for (let i = 0; i < n; i++) {
        sparks.push({ x: x * dpr, y: y * dpr, vx: rand(-1, 1) * dpr, vy: rand(-1.5, 0.5) * dpr, life: 1, r: rand(1.5, 3.5) * dpr, color: pick(LEAF_COLORS) });
      }
    }

    function drawSpark(s) {
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.04 * dpr;
      s.life -= 0.03;
      ctx.globalAlpha = Math.max(s.life, 0);
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * s.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      return s.life > 0;
    }

    /** Ledakan daun di titik (koordinat CSS px) */
    function burst(x, y, n = 18) {
      for (let i = 0; i < n; i++) leaves.push(makeLeaf(x * dpr, y * dpr, true));
    }

    // Isi awal: daun tersebar di seluruh layar supaya tidak kosong
    resize();
    if (FX.leaves) for (let i = 0; i < FX.leafCount; i++) leaves.push(makeLeaf(rand(0, w), rand(-h, h)));
    if (FX.fireflies) for (let i = 0; i < 18; i++) fireflies.push(makeFirefly());

    let running = true;
    function loop() {
      if (!running) return;
      // angin mengikuti kecepatan mouse, pelan-pelan reda
      wind += (mouse.vx * 0.08 - wind) * 0.05;
      mouse.vx *= 0.9;

      ctx.clearRect(0, 0, w, h);
      fireflies.forEach(drawFirefly);
      for (let i = leaves.length - 1; i >= 0; i--) {
        if (!updateLeaf(leaves[i])) leaves.splice(i, 1);
        else drawLeaf(leaves[i]);
      }
      for (let i = sparks.length - 1; i >= 0; i--) if (!drawSpark(sparks[i])) sparks.splice(i, 1);
      requestAnimationFrame(loop);
    }
    loop();

    // hemat baterai: berhenti saat tab tidak terlihat
    document.addEventListener("visibilitychange", () => {
      running = !document.hidden;
      if (running) loop();
    });
    addEventListener("resize", resize);

    return { burst, addSparks };
  }

  // ---------- Mouse global ----------
  function setupMouse(fx) {
    let lastX = mouse.x;
    addEventListener("pointermove", (e) => {
      mouse.vx = e.clientX - lastX;
      lastX = mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (fx && FX.cursorTrail && finePointer) fx.addSparks(e.clientX, e.clientY, 2);
    });

    // Klik di mana saja = ledakan daun; klik di luar kartu = kartu tertiup angin
    addEventListener("pointerdown", (e) => {
      if (fx && FX.leaves) fx.burst(e.clientX, e.clientY, e.target.closest("a, button") ? 8 : 18);
      if (!e.target.closest(".card")) {
        const card = $("#app");
        card.classList.remove("is-gust");
        void card.offsetWidth; // restart animasi
        card.classList.add("is-gust");
      }
    });
  }

  // ---------- Parallax bukit ----------
  function setupParallax() {
    const hills = [...document.querySelectorAll("[data-depth]")];
    let ticking = false;
    const update = () => {
      ticking = false;
      const mx = (mouse.x / innerWidth - 0.5) * 2;
      const my = (mouse.y / innerHeight - 0.5) * 2;
      for (const hill of hills) {
        const d = parseFloat(hill.dataset.depth);
        hill.style.transform = `translate3d(${-mx * d * 40}px, ${-my * d * 20 + scrollY * d * 0.4}px, 0)`;
      }
    };
    const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    addEventListener("pointermove", request);
    addEventListener("scroll", request, { passive: true });
  }

  // ---------- Tilt 3D + sorotan di kartu link ----------
  function setupTilt() {
    for (const card of document.querySelectorAll(".link")) {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", `${px * 100}%`);
        card.style.setProperty("--my", `${py * 100}%`);
        if (FX.tilt && finePointer) {
          card.style.setProperty("--ry", `${(px - 0.5) * 14}deg`);
          card.style.setProperty("--rx", `${(0.5 - py) * 14}deg`);
        }
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    }
  }

  // ---------- Riak klik ----------
  function setupRipple() {
    for (const node of document.querySelectorAll(".link, .social, .share")) {
      node.addEventListener("pointerdown", (e) => {
        const r = node.getBoundingClientRect();
        const size = Math.max(r.width, r.height);
        const ripple = document.createElement("span");
        ripple.className = "ripple";
        ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
        node.style.position ||= "relative";
        node.style.overflow = "hidden";
        node.append(ripple);
        ripple.addEventListener("animationend", () => ripple.remove());
      });
    }
  }

  // ---------- Badai daun (easter egg) ----------
  function setupStorm(fx) {
    $("#avatar").addEventListener("dblclick", () => {
      if (!fx) return;
      for (let i = 0; i < 6; i++) setTimeout(() => fx.burst(rand(0, innerWidth), rand(0, innerHeight * 0.6), 20), i * 150);
      toast("🍂 Badai daun!");
    });
  }

  // ---------- Bagikan ----------
  function setupShare() {
    $("#share").addEventListener("click", async () => {
      const data = { title: document.title, url: location.href };
      try {
        if (navigator.share) return await navigator.share(data);
        await navigator.clipboard.writeText(location.href);
        toast("🔗 Link profil disalin!");
      } catch (err) {
        if (err.name !== "AbortError") toast("Gagal membagikan, salin link dari address bar ya");
      }
    });
  }

  function init() {
    setupLoader();
    setupShare();
    setupRipple();
    if (reduceMotion) return; // tanpa animasi gerak untuk yang memilih "kurangi animasi"
    const fx = FX.leaves || FX.fireflies || FX.cursorTrail ? setupCanvas() : null;
    setupMouse(fx);
    setupParallax();
    setupTilt();
    setupStorm(fx);
  }

  init();
})();
