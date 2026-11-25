/*
 * LEAVES — bentuk daun dalam koordinat -50..50 (pusat 0,0, tangkai ke bawah).
 * Dipakai render.js (SVG di kartu spesimen) dan effects.js (Path2D di canvas),
 * jadi daun yang jatuh dan daun di kartu selalu sama bentuknya.
 *
 *   Leaves.blade(kind) -> path "d" bentuk daun
 *   Leaves.veins(kind) -> path "d" tulang daun + tangkai (untuk stroke)
 *   Leaves.KINDS       -> daftar jenis yang tersedia
 */
(() => {
  const DEG = Math.PI / 180;
  const pt = (x, y) => `${x.toFixed(1)} ${y.toFixed(1)}`;

  /** Ubah fungsi jari-jari r(sudut) jadi path tertutup. Sudut 0 = ujung atas, searah jarum jam. */
  function polar(r, sx = 44, sy = 44, dy = 0, step = 2) {
    let d = "";
    for (let a = -180; a <= 180; a += step) {
      const t = a * DEG;
      const rad = r(t, a);
      d += (d ? " L " : "M ") + pt(Math.sin(t) * rad * sx, -Math.cos(t) * rad * sy + dy);
    }
    return d + " Z";
  }

  /** Jari-jari dari titik kunci [sudut, r, ujung?]: ujung lancip, lekukan membulat */
  function keyed(keys) {
    return (t, a) => {
      let i = keys.findIndex((k) => k[0] >= a);
      if (i <= 0) i = 1;
      const [a0, r0, tip0] = keys[i - 1];
      const [a1, r1, tip1] = keys[i];
      const u = (a - a0) / (a1 - a0 || 1);
      if (tip0 && !tip1) return r1 + (r0 - r1) * Math.pow(1 - u, 1.7);
      if (!tip0 && tip1) return r0 + (r1 - r0) * Math.pow(u, 1.7);
      return r0 + (r1 - r0) * u;
    };
  }

  // Maple: 5 lobus lancip (atas, 2 samping atas, 2 samping bawah), bergerigi halus
  const MAPLE_KEYS = [
    [-180, 0.16, false], [-148, 0.32, false], [-114, 0.74, true], [-84, 0.42, false],
    [-52, 0.96, true], [-25, 0.42, false], [0, 1, true], [25, 0.42, false],
    [52, 0.96, true], [84, 0.42, false], [114, 0.74, true], [148, 0.32, false], [180, 0.16, false]
  ];
  const mapleR = keyed(MAPLE_KEYS);

  const SHAPES = {
    maple: () => polar((t, a) => {
      const r = mapleR(t, a);
      return r > 0.5 ? r + 0.028 * Math.abs(Math.sin(t * 22)) : r;
    }, 46, 46, 4),

    // Oak: memanjang dengan lekukan membulat di kedua sisi
    oak: () => polar((t) => (0.7 + 0.24 * Math.pow(Math.abs(Math.sin(t * 3.5)), 0.55)) * (0.82 + 0.18 * Math.cos(t)), 30, 48, 2),

    // Elm: lonjong, ujung runcing, tepi bergerigi
    elm: () => polar((t) => {
      const tip = 1 + 0.18 * Math.pow(Math.max(Math.cos(t), 0), 10);
      return (0.86 + 0.14 * Math.cos(t)) * tip * (1 + 0.035 * Math.abs(Math.sin(t * 15)));
    }, 26, 44, 0),

    // Ginkgo: kipas dengan belahan di tengah
    ginkgo: () => "M0 34 C -4 22 -30 6 -44 -16 C -36 -36 -16 -44 -3 -40 L 0 -29 L 3 -40 C 16 -44 36 -36 44 -16 C 30 6 4 22 0 34 Z"
  };

  const VEINS = {
    maple: () => {
      const tips = MAPLE_KEYS.filter((k) => k[2]);
      const base = "M0 46 Q 1 30 0 14";
      return base + tips.map(([a, r]) => ` M0 14 L ${pt(Math.sin(a * DEG) * r * 40, -Math.cos(a * DEG) * r * 40 + 4)}`).join("");
    },
    oak: () => "M0 48 L0 -40" + [-24, -8, 8, 24].map((y) => ` M0 ${y + 8} L -14 ${y - 2} M0 ${y + 8} L 14 ${y - 2}`).join(""),
    elm: () => "M0 48 L0 -44" + [-28, -14, 0, 14, 28].map((y) => ` M0 ${y + 6} L -16 ${y - 4} M0 ${y + 6} L 16 ${y - 4}`).join(""),
    ginkgo: () => "M0 48 L0 32" + [-40, -24, -8, 8, 24, 40].map((x) => ` M0 32 L ${x} ${-30 + Math.abs(x) * 0.25}`).join("")
  };

  const cache = new Map();
  const memo = (key, fn) => (cache.has(key) ? cache.get(key) : cache.set(key, fn()).get(key));

  window.Leaves = {
    KINDS: Object.keys(SHAPES),
    blade: (kind) => memo(`b:${kind}`, SHAPES[kind] ?? SHAPES.maple),
    veins: (kind) => memo(`v:${kind}`, VEINS[kind] ?? VEINS.maple)
  };
})();
