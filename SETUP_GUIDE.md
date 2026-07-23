# Panduan Integrasi Google Sheets & Google Apps Script

Ikuti panduan langkah-demi-langkah ini untuk menghubungkan Landing Page HR Curated Insights dengan spreadsheet Anda dan mengaktifkan pengiriman email otomatis.

---

## Langkah 1: Siapkan Spreadsheet & Kolom Header
1. Buka [Google Sheets](https://sheets.google.com) dan buat Spreadsheet Baru.
2. Beri nama spreadsheet Anda, misalnya: `Rekap Leads HR Curated Insights`.
3. Pada baris pertama (Row 1), buat header kolom berikut:
   * Kolom A: `Timestamp`
   * Kolom B: `Nama Lengkap`
   * Kolom C: `Nomor WhatsApp`
   * Kolom D: `Alamat Email`
   * Kolom E: `Nama Perusahaan`
   * Kolom F: `Jabatan / Posisi`

---

## Langkah 2: Buka Google Apps Script Editor
1. Di dalam spreadsheet yang baru Anda buat, klik menu **Extensions** (Ekstensi) > **Apps Script**.
2. Hapus semua kode default (seperti `function myFunction() { ... }`) di editor.
3. Buka file [GoogleAppsScript.js](file:///C:/Users/dicky/.gemini/antigravity/scratch/hr-curated-insights/GoogleAppsScript.js) yang telah kami buat untuk Anda.
4. Salin (Copy) seluruh isi kode tersebut dan tempel (Paste) ke editor Apps Script.

---

## Langkah 3: Sesuaikan Konfigurasi Script
Di bagian paling atas script, sesuaikan nilai pada objek `CONFIG`:
* `EMAIL_SUBJECT`: Judul email yang ingin Anda kirimkan ke prospek.
* `INSIGHT_LINK`: Tautan/Link tempat file PDF HR Curated Insights disimpan (misalnya link Google Drive yang diset ke *Public*, Dropbox, dll.).
* `SENDER_NAME`: Nama pengirim email (misal: nama brand atau nama Anda sendiri).

*Contoh:*
```javascript
const CONFIG = {
  EMAIL_SUBJECT: "🎁 [Akses Gratis] HR Curated Insights Anda Telah Siap!",
  INSIGHT_LINK: "https://drive.google.com/file/d/xxxxxx/view?usp=sharing",
  SENDER_NAME: "Budi dari HR Insight"
};
```
Setelah selesai mengedit, simpan proyek script dengan mengklik ikon **Save** (Disket) atau tekan `Ctrl + S`.

---

## Langkah 4: Publikasikan Script sebagai Web App (PENTING)
Agar Landing Page dapat mengirimkan data ke script ini, Anda harus menerbitkannya sebagai Aplikasi Web:

1. Di kanan atas editor Apps Script, klik tombol **Deploy** (Terapkan) > **New deployment** (Terapkan baru).
2. Klik ikon gir (pilih tipe penerapan) lalu pilih **Web app** (Aplikasi web).
3. Isi konfigurasi sebagai berikut:
   * **Description**: `Versi 1 - Lead Gen HR Insights` (Bebas).
   * **Execute as**: Pilih **Me** (Email Anda sendiri). Ini memastikan script dapat mengirim email menggunakan Gmail Anda dan menulis data ke Sheet Anda.
   * **Who has access**: Pilih **Anyone** (Siapa saja). Ini wajib dipilih agar pengunjung landing page dapat men-submit form tanpa harus login ke akun Google mereka.
4. Klik tombol **Deploy**.
5. Google akan meminta otorisasi keamanan karena script ini akan menulis ke Google Sheet dan mengirim email atas nama Anda. Klik **Authorize access** (Berikan Akses).
6. Pilih akun Google Anda. Jika muncul peringatan *"Google has not verified this app"*, klik **Advanced** (Lanjutan) > Klik **Go to Untitled project (unsafe)** atau nama project Anda.
7. Klik **Allow** (Izinkan).

---

## Langkah 5: Salin URL Web App Ke Landing Page Anda
1. Setelah deployment selesai, Google akan menampilkan **Web app URL**.
2. Salin URL tersebut. Formatnya akan mirip seperti ini:
   `https://script.google.com/macros/s/AKfycb.../exec`
3. Buka file JavaScript landing page Anda di [app.js](file:///C:/Users/dicky/.gemini/antigravity/scratch/hr-curated-insights/app.js).
4. Temukan variabel `SCRIPT_URL` di bagian atas file, lalu tempelkan URL tersebut di sana.

*Contoh di app.js:*
```javascript
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycb.../exec';
```
5. Simpan file `app.js`.

Sekarang Landing Page Anda sudah sepenuhnya terhubung dengan Google Sheets dan siap menerima prospek! 🎉
