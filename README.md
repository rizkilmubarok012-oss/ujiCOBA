# 📖 Qolbul Qur'an

Al-Qur'an Digital Premium dengan Tampilan Modern dan Elegan

![Qolbul Qur'an](https://img.shields.io/badge/Version-2.0-brightgreen)
![Platform](https://img.shields.io/badge/Platform-Web-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📋 Daftar Isi

- [Tentang Aplikasi](#tentang-aplikasi)
- [Fitur Unggulan](#fitur-unggulan)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Struktur Folder](#struktur-folder)
- [Cara Install & Menjalankan](#cara-install--menjalankan)
- [Cara Menambah Data](#cara-menambah-data)
- [Cara Mengubah Warna](#cara-mengubah-warna)
- [Cara Menggunakan](#cara-menggunakan)
- [Troubleshooting](#troubleshooting)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)

---

## 🕌 Tentang Aplikasi

**Qolbul Qur'an** adalah aplikasi Al-Qur'an digital berbasis web dengan desain modern, minimalis, dan responsif. Aplikasi ini dirancang untuk memberikan pengalaman membaca Al-Qur'an yang nyaman di perangkat mobile maupun desktop.

### Keunggulan:
- ✅ **Offline Support** - Bisa diakses tanpa internet (setelah pertama kali dibuka)
- ✅ **Data Tersimpan Lokal** - Semua data tersimpan di LocalStorage HP Anda
- ✅ **Mobile First** - Tampilan optimal di semua ukuran layar
- ✅ **Desain Premium** - Glassmorphism + Material Design 3
- ✅ **Dark Mode** - Tampilan malam yang nyaman di mata

---

## ✨ Fitur Unggulan

### 📊 Dashboard
| Fitur | Keterangan |
|-------|------------|
| **Greeting** | Sapaan berdasarkan waktu (Pagi/Siang/Sore/Malam) |
| **Statistik** | Total Surat, Jumlah Favorit, Selesai Dibaca, Progress % |
| **Terakhir Dibaca** | Menampilkan surat terakhir dengan tombol lanjutkan |
| **Aktivitas** | Mencatat aktivitas: baca, favorit, selesai |
| **Akses Cepat** | Tombol cepat ke Semua Surat, Favorit, Selesai, Pengaturan |

### 📖 Bacaan
| Fitur | Keterangan |
|-------|------------|
| **Daftar Surat** | Menampilkan semua surat dengan nama dan arab |
| **Pencarian** | Real-time search berdasarkan nama surat |
| **Baca Surat** | Menampilkan Arab, Latin, dan Terjemahan |
| **Text Justify** | Teks Arab rata kanan-kiri untuk kenyamanan membaca |

### ⭐ Manajemen Bacaan
| Fitur | Keterangan |
|-------|------------|
| **Favorit** | Tandai ayat favorit, tersimpan di LocalStorage |
| **Selesai Dibaca** | Tandai ayat yang sudah selesai dibaca |
| **Salin Ayat** | Salin Arab + Latin + Terjemahan ke clipboard |
| **Last Read** | Otomatis menyimpan posisi terakhir dibaca |

### ⚙️ Pengaturan
| Fitur | Keterangan |
|-------|------------|
| **Ukuran Font Arab** | Slider 14px - 48px |
| **Tampilkan Latin** | Show/Hide latin |
| **Tampilkan Terjemahan** | Show/Hide terjemahan |
| **Dark Mode** | Tampilan malam |
| **Mode Hemat** | Menghilangkan efek glassmorphism untuk performa |

---

## 🛠 Teknologi yang Digunakan

| Teknologi | Keterangan |
|-----------|------------|
| **HTML5** | Struktur aplikasi |
| **CSS3** | Styling dengan Glassmorphism + Material Design 3 |
| **Vanilla JavaScript** | Logika aplikasi tanpa library |
| **LocalStorage** | Penyimpanan data di perangkat |
| **Fonts** | Google Fonts (Amiri untuk Arab) |
| **API** | Al-Quran Cloud (opsional) |

---

## 📁 Struktur Folder

```
qolbul-quran/
├── index.html              # Halaman utama
├── css/
│   └── style.css           # File CSS lengkap
├── js/
│   ├── data.js             # TEMPAT DATA BACANAN
│   ├── app.js              # Aplikasi utama
│   ├── dashboard.js        # Dashboard & statistik
│   ├── semua.js            # Daftar surat & baca
│   ├── favorid.js          # Fitur favorit
│   ├── selesai.js          # Fitur selesai dibaca
│   └── pengaturan.js       # Pengaturan aplikasi
└── README.md               # Dokumentasi
```

---

## 🚀 Cara Install & Menjalankan

### Cara 1: Langsung Buka di Browser
1. Download semua file
2. Buka file `index.html` di browser
3. Aplikasi siap digunakan

### Cara 2: Menggunakan Live Server (VS Code)
1. Install ekstensi **Live Server** di VS Code
2. Klik kanan pada `index.html`
3. Pilih **Open with Live Server**

### Cara 3: Hosting (Online)
1. Upload semua file ke hosting (Netlify, Vercel, dll)
2. Akses melalui domain Anda

---

## 📝 Cara Menambah Data

### Buka file `js/data.js`

Format data bacaan:

```javascript
{
  id: 1,                              // ID unik (berurutan)
  title: "Judul Bacaan",              // Nama surat/doa
  subtitle: "Keterangan",             // Nama Arab atau keterangan
  category: "quran",                  // Kategori: quran, tawasul, doa, wirid, shalawat, dll
  verses: [                           // Array ayat
    {
      arabic: "تulisan arab",         // Teks Arab
      latin: "bacaan latin",          // Teks Latin
      translation: "terjemahan"       // Terjemahan Indonesia
    }
  ],
  totalVerses: 1                      // Jumlah ayat
}
```

### Contoh Menambah Data:

```javascript
// Di dalam array READINGS_DATA
{
  id: 100,
  title: "Doa Sebelum Tidur",
  subtitle: "دعاء النوم",
  category: "doa",
  verses: [
    {
      arabic: "بِاسْمِكَ اللَّهُمَّ أَحْيَا وَبِاسْمِكَ أَمُوتُ",
      latin: "Bismikallahumma ahya wa bismika amut",
      translation: "Dengan nama-Mu ya Allah aku hidup dan dengan nama-Mu aku mati"
    }
  ],
  totalVerses: 1
}
```

---

## 🎨 Cara Mengubah Warna

Buka file `css/style.css` dan cari bagian `:root`:

```css
:root {
    /* ===== WARNA UTAMA ===== */
    --primary: #0F8B4C;           /* Warna utama - Ganti sesuai selera */
    --primary-light: #2ECC71;      /* Warna lebih terang */
    --primary-dark: #0A6E3A;       /* Warna lebih gelap */
    
    /* ===== WARNA GRADIENT ===== */
    --gradient-start: #0F8B4C;     /* Warna gradient awal */
    --gradient-end: #2ECC71;       /* Warna gradient akhir */
    
    /* ===== WARNA BACKGROUND ===== */
    --bg-primary: #F0F4F0;         /* Background utama */
    --bg-card: rgba(255, 255, 255, 0.85);  /* Background card */
    
    /* ===== WARNA TEXT ===== */
    --text-primary: #1A2A1A;       /* Warna teks utama */
    --text-secondary: #4A6A4A;     /* Warna teks sekunder */
}
```

### Contoh Ubah Warna Menjadi Biru:

```css
:root {
    --primary: #1A56DB;
    --primary-light: #3B82F6;
    --primary-dark: #1E40AF;
    --gradient-start: #1A56DB;
    --gradient-end: #3B82F6;
    --bg-primary: #F0F4FF;
}
```

### Contoh Ubah Warna Menjadi Emas:

```css
:root {
    --primary: #D97706;
    --primary-light: #F59E0B;
    --primary-dark: #B45309;
    --gradient-start: #D97706;
    --gradient-end: #F59E0B;
    --bg-primary: #FFFBEB;
}
```

---

## 📱 Cara Menggunakan

### Navigasi
| Tombol | Fungsi |
|--------|--------|
| **Beranda** | Halaman Dashboard |
| **Semua** | Daftar semua surat |
| **Favorit** | Daftar ayat favorit |
| **Pengaturan** | Pengaturan aplikasi |

### Membaca Surat
1. Klik surat yang ingin dibaca
2. Gulir untuk membaca ayat
3. Gunakan tombol **Kembali ke Atas** (lingkaran hijau) untuk kembali ke atas

### Menandai Ayat
| Tombol | Fungsi |
|--------|--------|
| **☆ Favorit** | Tandai ayat sebagai favorit |
| **□ Selesai** | Tandai ayat sudah selesai dibaca |
| **📋 Salin** | Salin Arab + Latin + Terjemahan |

---

## 🔧 Troubleshooting

### Masalah: Data tidak muncul
**Solusi:**
1. Buka Console Browser (F12 → Console)
2. Cek apakah ada error
3. Pastikan file `data.js` memiliki format yang benar

### Masalah: Favorit/Selesai hilang setelah refresh
**Solusi:**
1. Data tersimpan di LocalStorage
2. Pastikan browser tidak dalam mode Private/Incognito
3. Cek LocalStorage: F12 → Application → Local Storage

### Masalah: Tampilan berantakan
**Solusi:**
1. Pastikan semua file CSS ter-load
2. Clear cache browser (Ctrl+Shift+Delete)
3. Refresh dengan Ctrl+F5

### Masalah: Dark Mode tidak berfungsi
**Solusi:**
1. Pastikan setting tersimpan di LocalStorage
2. Cek di Pengaturan → Dark Mode
3. Refresh halaman

---

## 👥 Kontribusi

Jika Anda ingin berkontribusi:

1. **Fork** repository ini
2. **Clone** ke lokal
3. Buat **branch** baru: `git checkout -b fitur-baru`
4. **Commit** perubahan: `git commit -m 'Menambah fitur baru'`
5. **Push** ke branch: `git push origin fitur-baru`
6. Buat **Pull Request**

### Yang Bisa Dikontribusikan:
- ✅ Menambah data bacaan
- ✅ Memperbaiki bug
- ✅ Menambah fitur baru
- ✅ Meningkatkan performa
- ✅ Memperbaiki UI/UX

---

## 📄 Lisensi

MIT License

Copyright (c) 2024 Qolbul Qur'an

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

---

## 🙏 Terima Kasih

- **Al-Quran Cloud** - API Al-Qur'an
- **Google Fonts** - Font Amiri untuk teks Arab
- **Semua Kontributor** - Yang telah membantu pengembangan

---

## 📞 Kontak

- **Email**: rizkilmubarok012@gmail.com
- **GitHub**: [rizkii-22](https://github.com/rizkii-22)

---

**Qolbul Qur'an** - Mari Dekatkan Diri dengan Al-Qur'an 📖✨