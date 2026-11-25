/*
 * RENDER — membangun isi halaman dari window.PROFILE (config.js).
 * Tiap bagian punya fungsi sendiri; untuk bagian baru, buat fungsi
 * render baru lalu panggil di init() paling bawah.
 * Teks dari config selalu dipasang lewat textContent (aman dari HTML).
 */
(() => {
  const P = window.PROFILE;
  const $ = (sel) => document.querySelector(sel);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** Buat elemen: el("a", "link", { href: "#" }, [child1, child2]) */
  function el(tag, className, attrs = {}, children = []) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
    for (const child of [].concat(children)) {
      if (child == null) continue;
      node.append(child);
    }
    return node;
  }

  const icon = (cls) => el("i", cls, { "aria-hidden": "true" });

  /** Animasi masuk bertahap: tiap pemanggilan menambah jeda */
  let delay = 0.3;
  function reveal(node, step = 0.08) {
    node.classList.add("reveal");
    node.style.setProperty("--delay", `${delay.toFixed(2)}s`);
    delay += step;
    return node;
  }

  // ---------- Profil ----------
  function renderAvatar() {
    const box = $("#avatar");
    if (P.avatar) {
      box.append(el("img", "", { src: P.avatar, alt: `Foto ${P.name}` }));
    } else {
      const initials = P.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
      box.textContent = initials;
      box.setAttribute("role", "img");
      box.setAttribute("aria-label", P.name);
    }
    // daun kecil yang mengorbit
    const orbit = el("div", "orbit", { "aria-hidden": "true" });
    ["🍁", "🍂", "🍃", "🍁"].forEach((leaf, i) => {
      const span = el("span", "", {}, leaf);
      span.style.setProperty("--a", `${i * 90}deg`);
      orbit.append(span);
    });
    box.append(orbit);
    reveal(box, 0.15);
  }

  function renderName() {
    const h1 = $("#name");
    h1.setAttribute("aria-label", P.name);
    // tiap huruf jatuh satu per satu
    for (const ch of P.name) {
      const span = el("span", "char", { "aria-hidden": "true" }, ch === " " ? " " : ch);
      reveal(span, 0.04);
      h1.append(span);
    }
  }

  function renderText(selector, value, iconClass) {
    const node = $(selector);
    if (!value) return node.remove();
    if (iconClass) node.append(icon(iconClass));
    node.append(value);
    reveal(node);
  }

  /** Efek mengetik yang berganti-ganti antar roles */
  function typewriter(target, words) {
    if (!words?.length) return target.parentElement.remove();
    reveal(target.parentElement);
    if (reduceMotion) return (target.textContent = words.join(" · "));

    let word = 0, char = 0, deleting = false;
    const tick = () => {
      const current = words[word];
      char += deleting ? -1 : 1;
      target.textContent = current.slice(0, char);

      let wait = deleting ? 45 : 95;
      if (!deleting && char === current.length) { deleting = true; wait = 1600; }
      else if (deleting && char === 0) { deleting = false; word = (word + 1) % words.length; wait = 350; }
      setTimeout(tick, wait);
    };
    setTimeout(tick, 1400);
  }

  // ---------- Statistik ----------
  function countUp(node, to, suffix = "") {
    if (reduceMotion) return (node.textContent = to + suffix);
    const duration = 1600;
    const start = performance.now();
    const frame = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      node.textContent = Math.round(to * eased) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  function renderStats() {
    const box = $("#stats");
    if (!P.stats?.length) return box.remove();
    for (const s of P.stats) {
      const value = el("div", "stat__value", {}, "0");
      box.append(reveal(el("div", "stat", {}, [value, el("div", "stat__label", {}, s.label)])));
      setTimeout(() => countUp(value, s.value, s.suffix), delay * 1000);
    }
  }

  // ---------- Link ----------
  function renderLinks() {
    const box = $("#links");
    for (const link of P.links ?? []) {
      if (!link.url) continue;
      const card = el("a", `link${link.highlight ? " link--highlight" : ""}`, {
        href: link.url, target: "_blank", rel: "noopener noreferrer"
      }, [
        el("span", "link__icon", {}, icon(link.icon || "fa-solid fa-link")),
        el("span", "link__text", {}, [
          el("span", "link__title", {}, link.title),
          link.description ? el("span", "link__desc", {}, link.description) : null
        ]),
        icon("fa-solid fa-arrow-right link__arrow"),
        link.badge ? el("span", "link__badge", {}, link.badge) : null
      ]);
      box.append(reveal(card, 0.1));
    }
  }

  // ---------- Sosial ----------
  function renderSocials() {
    const box = $("#socials");
    if (!P.socials?.length) return box.remove();
    for (const s of P.socials) {
      if (!s.url) continue;
      box.append(reveal(el("a", "social", {
        href: s.url, target: "_blank", rel: "noopener noreferrer", "aria-label": s.name, title: s.name
      }, icon(s.icon)), 0.07));
    }
  }

  function init() {
    document.title = P.name;
    // .reveal dilepas setelah kartu muncul, supaya efek "tertiup angin" tidak memutar ulang animasi masuk
    const app = reveal($("#app"), 0.2);
    app.addEventListener("animationend", (e) => { if (e.target === app) app.classList.remove("reveal"); });
    renderAvatar();
    renderName();
    renderText("#username", P.username);
    typewriter($("#role"), P.roles);
    renderText("#bio", P.bio);
    renderText("#location", P.location, "fa-solid fa-location-dot");
    renderStats();
    renderLinks();
    renderSocials();
    $("#footer").textContent = P.footer ?? "";
  }

  init();
})();
