# Herbarium Bisma

Halaman profil + kumpulan tautan bergaya **herbarium musim gugur**: setiap tautan adalah spesimen daun kering yang ditempel selotip di atas kertas kraft, lengkap dengan label katalog.
HTML, CSS, dan JavaScript biasa, tanpa framework, tanpa build.

Online di **https://masbismaa.github.io/**

## Menjalankan

Klik dua kali `index.html`.

## Mengubah isi

**Semua isi ada di `js/config.js`.** File lain tidak perlu disentuh.

| Mau apa | Caranya di `config.js` |
|---|---|
| Ganti nama / bio / lokasi | ubah `name`, `bio`, `location` |
| Catatan tulisan tangan | ubah daftar `roles` |
| Pasang foto (gaya polaroid) | taruh di `assets/`, isi `photo: "assets/foto.jpg"` |
| Tambah tautan | tambah 1 objek ke `links` |
| Tambah tautan kecil di kiri | tambah 1 objek ke `socials` |
| Atur efek | ubah `effects` |

Contoh tambah tautan:

```js
{
  title: "Instagram",
  note: "Foto & story harian",
  url: "https://instagram.com/akunmu",
  leaf: "oak",     // maple | oak | elm | ginkgo
  color: "rust"    // maple | rust | ochre | moss
},
```

Nomor spesimen (No. 01, 02, ...), alamat di label, dan jumlah spesimen di buku katalog terisi otomatis.

## Struktur

```
index.html          kerangka halaman (tanpa data)
css/
  base.css          token warna & huruf (:root), tata letak lembar
  scene.css         tekstur kertas kraft, canvas daun
  components.css    kolom kolektor, spesimen, selotip, label, toast
  animations.css    adegan pembuka + mode "kurangi animasi"
js/
  config.js         ★ DATA — edit di sini
  leaves.js         bentuk daun (dipakai kartu & daun yang jatuh)
  render.js         membangun halaman dari config
  effects.js        angin, daun berguguran, interaksi
assets/             foto
```

## Gerak

- **Pembuka:** teks kolektor naik pelan, coretan merah di bawah nama tergambar, spesimen "ditekan" ke kertas satu per satu lalu selotipnya menempel.
- **Angin:** tiap 5–9 detik ada embusan. Daun di latar terbawa, spesimen bergoyang dari selotipnya, daun di kartu melambai dari tangkainya.
- **Daun berguguran** memakai bentuk yang sama dengan spesimen, berputar dan membalik.
- **Klik/tap** di mana saja: embusan dari titik itu, daun di dekatnya terdorong, beberapa daun lepas.
- **Hover spesimen:** kertas terangkat, bayangan memanjang, daun membesar sedikit.

Pengguna yang mengaktifkan "kurangi animasi" di sistemnya mendapat versi diam.

## Online (GitHub Pages)

Repo `Masbismaa.github.io` otomatis tayang di https://masbismaa.github.io/. Push ke `main`, tunggu ±1 menit.
