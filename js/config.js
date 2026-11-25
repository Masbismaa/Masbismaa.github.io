/*
 * ============================================================
 *  CONFIG — satu-satunya file yang perlu kamu ubah.
 * ============================================================
 *  Tambah link / sosial / statistik baru = tambah satu objek
 *  ke array yang sesuai. Urutan di array = urutan di halaman.
 *
 *  Ikon memakai Font Awesome 6 (https://fontawesome.com/search?ic=free):
 *    brand  -> "fa-brands fa-github"
 *    umum   -> "fa-solid fa-gamepad"
 *
 *  Field yang kosong ("" atau dihapus) tidak ditampilkan.
 * ============================================================
 */
window.PROFILE = {
  // ---------- Identitas ----------
  name: "Bisma Prasetya",
  username: "@masbismaa",
  // Path gambar (mis. "assets/avatar.jpg") atau URL. Kosong = inisial nama.
  avatar: "",
  location: "Indonesia",
  // Teks yang berganti-ganti dengan efek mengetik
  roles: ["Developer", "Server Owner", "Bot Builder", "Gamer"],
  bio: "Membangun dunia roleplay Classic Chronicles, satu baris kode setiap hari. 🍂",

  // ---------- Statistik kecil di bawah bio ----------
  // value angka akan dianimasikan menghitung naik. suffix opsional.
  stats: [
    { label: "Project", value: 12, suffix: "+" },
    { label: "Commit", value: 500, suffix: "+" },
    { label: "Kopi", value: 999, suffix: "☕" }
  ],

  // ---------- Tombol link utama ----------
  // highlight: true  -> kartu disorot (glow emas)
  // badge: "NEW"     -> label kecil di pojok kartu
  links: [
    {
      title: "Classic Chronicles Roleplay",
      description: "Gabung Discord server SA-MP roleplay kami",
      url: "https://discord.gg/5nZCnXZaN5",
      icon: "fa-brands fa-discord",
      highlight: true,
      badge: "JOIN"
    },
    {
      title: "GitHub",
      description: "Lihat project & source code",
      url: "https://github.com/Masbismaa",
      icon: "fa-brands fa-github"
    },
    {
      title: "YouTube",
      description: "Video & live streaming",
      url: "https://youtube.com/@username", // TODO: ganti
      icon: "fa-brands fa-youtube"
    },
    {
      title: "TikTok",
      description: "Clip roleplay harian",
      url: "https://tiktok.com/@username", // TODO: ganti
      icon: "fa-brands fa-tiktok",
      badge: "NEW"
    }
  ],

  // ---------- Ikon sosial bulat di bawah ----------
  socials: [
    { name: "Instagram", url: "https://instagram.com/username", icon: "fa-brands fa-instagram" }, // TODO: ganti
    { name: "GitHub", url: "https://github.com/Masbismaa", icon: "fa-brands fa-github" },
    { name: "Discord", url: "https://discord.gg/5nZCnXZaN5", icon: "fa-brands fa-discord" }
  ],

  // ---------- Footer ----------
  footer: "Dibuat dengan 🍁 dan secangkir kopi hangat",

  // ---------- Efek (matikan yang tidak suka) ----------
  effects: {
    leaves: true,       // daun berguguran (klik layar = ledakan daun)
    leafCount: 38,      // jumlah daun di layar
    cursorTrail: true,  // jejak percikan di kursor
    tilt: true,         // kartu miring 3D mengikuti mouse
    fireflies: true,    // kunang-kunang berkedip
    loader: true        // animasi pembuka
  }
};
