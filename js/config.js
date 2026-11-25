/*
 * ============================================================
 *  CONFIG — satu-satunya file yang perlu diubah.
 * ============================================================
 *  Halaman ini adalah "herbarium": setiap link = satu spesimen
 *  daun yang ditempel di kertas, lengkap dengan label katalog.
 *
 *  Tambah link  -> tambah satu objek ke `links`.
 *  Urutan array -> urutan spesimen (No. 01, 02, ...).
 *
 *  leaf  : "maple" | "oak" | "elm" | "ginkgo"  (bentuk daun)
 *  color : "maple" | "ochre" | "moss" | "rust" (warna daun)
 *  Kosongkan leaf/color untuk pilihan otomatis bergantian.
 * ============================================================
 */
window.PROFILE = {
  name: "Bisma Prasetya",
  handle: "@masbismaa",
  location: "Indonesia",
  season: "Musim Gugur 2026",
  // Catatan tulisan tangan di bawah nama
  roles: ["developer", "pemilik server", "pembuat bot"],
  bio: "Membangun Classic Chronicles, server roleplay SA-MP, sekaligus bot Discord dan perkakas yang menjalankannya.",
  // Opsional: foto ditempel seperti polaroid. Contoh: "assets/foto.jpg". Kosong = tidak ditampilkan.
  photo: "",

  links: [
    {
      title: "Classic Chronicles",
      note: "Discord server roleplay SA-MP",
      url: "https://discord.gg/5nZCnXZaN5",
      leaf: "maple",
      color: "maple"
    },
    {
      title: "GitHub",
      note: "Source code bot & gamemode",
      url: "https://github.com/Masbismaa",
      leaf: "ginkgo",
      color: "ochre"
    },
    {
      title: "YouTube",
      note: "Video & live streaming",
      url: "https://youtube.com/@username", // TODO: ganti
      leaf: "oak",
      color: "rust"
    },
    {
      title: "TikTok",
      note: "Clip roleplay harian",
      url: "https://tiktok.com/@username", // TODO: ganti
      leaf: "elm",
      color: "moss"
    }
  ],

  // Tautan kecil di kolom kiri ("Juga ditemukan di")
  socials: [
    { name: "Instagram", url: "https://instagram.com/username" }, // TODO: ganti
    { name: "GitHub", url: "https://github.com/Masbismaa" }
  ],

  effects: {
    leaves: true,   // daun berguguran di latar
    leafCount: 16,  // jumlah daun
    wind: true      // embusan angin berkala (spesimen ikut bergoyang)
  }
};
