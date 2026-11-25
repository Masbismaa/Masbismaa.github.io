/*
 * RENDER — membangun halaman dari window.PROFILE (config.js).
 * Satu fungsi per bagian; bagian baru = fungsi baru, panggil di init().
 * Teks dari config dipasang lewat textContent (aman dari HTML).
 */
(() => {
  const P = window.PROFILE;
  const $ = (sel) => document.querySelector(sel);
  const SVG = "http://www.w3.org/2000/svg";
  const COLORS = ["maple", "ochre", "rust", "moss"];

  /** el("a", "kelas", { href }, [anak]) */
  function el(tag, className, attrs = {}, children = []) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    for (const child of [].concat(children)) if (child != null) node.append(child);
    return node;
  }

  function svg(tag, attrs = {}) {
    const node = document.createElementNS(SVG, tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    return node;
  }

  const pad = (n) => String(n).padStart(2, "0");
  // "Lokasi" spesimen: alamat tanpa https:// dan www., mis. discord.gg/5nZCnXZaN5
  const host = (url) => {
    try {
      const u = new URL(url);
      return (u.host + u.pathname).replace(/^www\./, "").replace(/\/$/, "");
    } catch { return url; }
  };

  // Miring tiap spesimen dibuat tetap (bukan acak) supaya tata letak tidak berubah tiap dibuka
  const tiltOf = (i) => [-2.2, 1.6, -0.8, 2.4, -1.4, 0.9][i % 6];

  // ---------- Kolom kolektor (kiri) ----------
  function renderCollector() {
    $("#eyebrow").textContent = `Herbarium · ${P.season}`;

    const name = $("#name");
    name.textContent = P.name;
    // coretan garis bawah tangan, digambar saat halaman dibuka
    const scribble = svg("svg", { class: "scribble", viewBox: "0 0 320 18", preserveAspectRatio: "none", "aria-hidden": "true" });
    scribble.append(svg("path", { d: "M3 12 C 50 4, 110 15, 170 8 S 270 6, 317 11", pathLength: "1" }));
    name.append(scribble);

    const roles = $("#roles");
    if (P.roles?.length) roles.textContent = P.roles.join(", ");
    else roles.remove();

    $("#bio").textContent = P.bio ?? "";

    if (P.photo) {
      const photo = el("figure", "photo", {}, el("img", "", { src: P.photo, alt: `Foto ${P.name}` }));
      $("#collector").prepend(photo);
    }

    // Data katalog: istilah herbarium sungguhan (kolektor, lokasi, jumlah spesimen)
    const rows = [
      ["Kolektor", P.name],
      ["Nama pena", P.handle],
      ["Lokasi", P.location],
      ["Spesimen", `${P.links.filter((l) => l.url).length} lembar`]
    ];
    const ledger = $("#ledger");
    for (const [k, v] of rows) {
      if (!v) continue;
      ledger.append(el("div", "ledger__row", {}, [el("dt", "", {}, k), el("dd", "", {}, v)]));
    }

    const elsewhere = $("#elsewhere");
    const socials = (P.socials ?? []).filter((s) => s.url);
    if (!socials.length) return elsewhere.remove();
    elsewhere.append("Juga ditemukan di ");
    socials.forEach((s, i) => {
      if (i) elsewhere.append(i === socials.length - 1 ? " dan " : ", ");
      elsewhere.append(el("a", "", { href: s.url, target: "_blank", rel: "noopener noreferrer" }, s.name));
    });
    elsewhere.append(".");
  }

  // ---------- Spesimen (kanan) ----------
  function leafSvg(kind) {
    const node = svg("svg", { class: "leaf", viewBox: "-52 -52 104 104", "aria-hidden": "true" });
    node.append(
      svg("path", { class: "leaf__blade", d: window.Leaves.blade(kind) }),
      svg("path", { class: "leaf__veins", d: window.Leaves.veins(kind) })
    );
    return node;
  }

  function renderSpecimens() {
    const box = $("#specimens");
    P.links.filter((l) => l.url).forEach((link, i) => {
      const kind = link.leaf || window.Leaves.KINDS[i % window.Leaves.KINDS.length];
      const color = link.color || COLORS[i % COLORS.length];

      const card = el("a", "specimen", { href: link.url, target: "_blank", rel: "noopener noreferrer" }, [
        el("span", "tape tape--left", { "aria-hidden": "true" }),
        el("span", "tape tape--right", { "aria-hidden": "true" }),
        el("span", "specimen__mount", {}, leafSvg(kind)),
        el("span", "label", {}, [
          el("span", "label__no", {}, `No. ${pad(i + 1)}`),
          el("span", "label__title", {}, link.title),
          link.note ? el("span", "label__note", {}, link.note) : null,
          el("span", "label__loc", {}, [host(link.url), el("span", "label__go", { "aria-hidden": "true" }, " ↗")])
        ])
      ]);
      card.style.setProperty("--tilt", `${tiltOf(i)}deg`);
      card.style.setProperty("--leaf", `var(--${color})`);
      card.style.setProperty("--i", i);
      // seberapa lentur spesimen ini saat angin bertiup
      card.style.setProperty("--flex", (0.6 + (i % 3) * 0.25).toFixed(2));
      box.append(card);
    });
  }

  renderCollector();
  renderSpecimens();
  document.documentElement.classList.add("is-ready");
})();
