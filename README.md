# 🍁 Profile Site (Autumn)

Halaman profil + kumpulan link (seperti Linktree) bertema musim gugur, penuh animasi.
HTML, CSS, dan JavaScript biasa, tanpa framework, tanpa build, tanpa server.

## Menjalankan

Klik dua kali `index.html`, langsung terbuka di browser.

## Mengubah isi

**Semua isi ada di `js/config.js`.** File lain tidak perlu disentuh.

| Mau apa | Caranya di `config.js` |
|---|---|
| Ganti nama / bio / lokasi | ubah `name`, `bio`, `location` |
| Pasang foto | taruh foto di `assets/`, isi `avatar: "assets/foto.jpg"` |
| Teks yang berganti-ganti | tambah kata ke `roles` |
| Tambah tombol link | tambah 1 objek ke `links` |
| Tambah ikon sosial | tambah 1 objek ke `socials` |
| Tambah statistik | tambah 1 objek ke `stats` |
| Matikan efek | ubah `effects` jadi `false` |

Contoh tambah link:

```js
{
  title: "Instagram",
  description: "Foto & story harian",
  url: "https://instagram.com/akunmu",
  icon: "fa-brands fa-instagram",
  highlight: false,   // true = kartu disorot
  badge: "HOT"        // opsional
},
```

Nama ikon dicari di <https://fontawesome.com/search?ic=free> (pilih yang gratis).

## Struktur

```
index.html          kerangka halaman (tidak berisi data)
css/
  base.css          warna (token di :root), reset, layout
  scene.css         latar: langit, matahari, bukit, kabut
  components.css    avatar, statistik, kartu link, sosial, toast, loader
  animations.css    semua @keyframes + mode "kurangi animasi"
js/
  config.js         ★ DATA PROFIL — edit di sini
  render.js         membangun halaman dari config
  effects.js        animasi interaktif (canvas daun, tilt, parallax, dll)
assets/             foto / gambar
```

Ganti warna tema cukup di `:root` pada `css/base.css`.

## Daftar animasi

- Loader daun bergoyang saat membuka halaman
- Langit senja berubah warna pelan, matahari berdenyut, bukit naik dan bergerak parallax
- Daun maple & daun lonjong berguguran: berputar, membalik 3D, tertiup angin dari gerakan mouse
- Klik di mana saja = ledakan daun, klik di luar kartu = kartu tertiup angin
- Kunang-kunang berkedip, jejak percikan di kursor
- Cincin api berputar di avatar + daun yang mengorbit
- Nama jatuh huruf demi huruf dengan kilau gradien
- Efek mengetik untuk `roles`, angka statistik menghitung naik
- Kartu link: muncul bertahap, miring 3D mengikuti mouse, sorotan cahaya, kilau menyapu, ikon bergoyang, riak saat klik
- Badge melayang, kartu `highlight` berdenyut
- **Rahasia:** klik dua kali avatar 🍂

Pengguna yang mengaktifkan "kurangi animasi" di sistemnya otomatis mendapat versi tanpa gerakan.

## Online gratis (GitHub Pages)

1. Buat repo baru di GitHub, misalnya `profile`, lalu push folder ini.
2. Repo → **Settings** → **Pages** → Source: **Deploy from a branch** → `main` / `root` → Save.
3. Tunggu ±1 menit, situs ada di `https://<username>.github.io/profile/`.

Mau alamat `https://<username>.github.io/` saja? Beri nama repo `<username>.github.io`.
