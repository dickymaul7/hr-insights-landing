/**
 * app.js - Lead Generation Interaction Logic
 * 
 * Silakan ikuti SETUP_GUIDE.md untuk mendapatkan URL Google Web App
 * dan menempelkannya pada variabel SCRIPT_URL di bawah ini.
 */

// TEMPELKAN URL WEB APP GOOGLE APPS SCRIPT ANDA DI SINI
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyXQSmu7hlrO-vHVxDt6xFm5zzFBO0pm5krYobBHvKcpx47y2Rh1PbeigOs1XTUz9_e/exec';

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const leadForm = document.getElementById('leadForm');
  const formCard = document.getElementById('formCard');
  const successCard = document.getElementById('successCard');
  const submitBtn = document.getElementById('submitBtn');
  const resetBtn = document.getElementById('resetBtn');
  
  const successUser = document.getElementById('successUser');
  const successEmail = document.getElementById('successEmail');

  // Input Fields
  const fields = {
    nama: {
      input: document.getElementById('nama'),
      error: document.getElementById('namaError'),
      validate: (val) => val.trim().length > 0
    },
    whatsapp: {
      input: document.getElementById('whatsapp'),
      error: document.getElementById('whatsappError'),
      // Regex untuk memvalidasi nomor telepon minimal 10 digit angka (boleh diawali +)
      validate: (val) => {
        const cleanVal = val.replace(/[\s\-\(\)]/g, ''); // Hapus spasi, strip, kurung
        return /^\+?[0-9]{10,15}$/.test(cleanVal);
      }
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('emailError'),
      // Regex standar validasi email
      validate: (val) => {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val.trim());
      }
    },
    perusahaan: {
      input: document.getElementById('perusahaan'),
      error: document.getElementById('perusahaanError'),
      validate: (val) => val.trim().length > 0
    },
    jabatan: {
      input: document.getElementById('jabatan'),
      error: document.getElementById('jabatanError'),
      validate: (val) => val.trim().length > 0
    }
  };

  // Validasi Input Individual saat user mengetik / blur
  Object.keys(fields).forEach(key => {
    const field = fields[key];
    
    // Validasi ketika kehilangan fokus (blur)
    field.input.addEventListener('blur', () => {
      validateField(field);
    });

    // Hapus error ketika mengetik
    field.input.addEventListener('input', () => {
      if (field.input.parentElement.classList.contains('invalid')) {
        validateField(field);
      }
    });
  });

  // Fungsi untuk memvalidasi satu field
  function validateField(field) {
    const isValid = field.validate(field.input.value);
    if (!isValid) {
      field.input.parentElement.classList.add('invalid');
    } else {
      field.input.parentElement.classList.remove('invalid');
    }
    return isValid;
  }

  // Submit Handler
  leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validasi seluruh input
    let isFormValid = true;
    let firstInvalidInput = null;

    Object.keys(fields).forEach(key => {
      const field = fields[key];
      const isValid = validateField(field);
      if (!isValid) {
        isFormValid = false;
        if (!firstInvalidInput) {
          firstInvalidInput = field.input;
        }
      }
    });

    // Jika form tidak valid, fokus ke input bermasalah pertama
    if (!isFormValid) {
      if (firstInvalidInput) {
        firstInvalidInput.focus();
      }
      return;
    }

    // Ambil nilai data formulir
    const payload = {
      nama: fields.nama.input.value.trim(),
      whatsapp: fields.whatsapp.input.value.trim(),
      email: fields.email.input.value.trim(),
      perusahaan: fields.perusahaan.input.value.trim(),
      jabatan: fields.jabatan.input.value.trim()
    };

    // Ubah status tombol menjadi Loading
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Kunci semua input selama pemrosesan
    Object.keys(fields).forEach(key => {
      fields[key].input.disabled = true;
    });

    // Cek jika SCRIPT_URL masih berupa placeholder
    if (SCRIPT_URL === 'YOUR_GOOGLE_WEB_APP_URL_HERE') {
      // Tampilkan notifikasi simulasi sukses jika script URL belum diisi
      console.warn("SCRIPT_URL belum dikonfigurasi. Menjalankan mode demo/simulasi.");
      
      // Simulasi delay jaringan 1.5 detik
      setTimeout(() => {
        showSuccess(payload);
      }, 1500);
      return;
    }

    try {
      // Gunakan fetch POST ke Google Apps Script Web App
      // Kita gunakan mode 'no-cors' jika script tidak mengembalikan CORS header yang kompatibel,
      // tetapi script kita di GoogleAppsScript.js sudah diset mengembalikan header CORS.
      // Jadi kita gunakan fetch standar.
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'text/plain' // Menggunakan text/plain menghindari preflight request CORS yang rumit di beberapa server
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        showSuccess(payload);
      } else {
        throw new Error(result.message || 'Terjadi kesalahan sistem.');
      }

    } catch (error) {
      console.error('Submission error:', error);
      
      // Penanganan Error User-Friendly
      alert(`Oops! Gagal mengirimkan data.\nDetail: ${error.message || 'Koneksi terputus.'}\n\nCatatan: Pastikan Anda telah melakukan Deploy Google Apps Script sebagai Web App dengan akses "Anyone" (Siapa saja) dan menempelkan URL-nya di app.js.`);
      
      // Kembalikan status tombol dan input ke semula
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      Object.keys(fields).forEach(key => {
        fields[key].input.disabled = false;
      });
    }
  });

  // Fungsi Tampil Sukses
  function showSuccess(data) {
    // Isi konten kartu sukses
    successUser.textContent = data.nama;
    successEmail.textContent = data.email;

    // Transisi Kartu
    formCard.classList.add('hidden');
    successCard.classList.remove('hidden');
    
    // Gulir halus ke kartu sukses
    successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Reset Handler (Kembali ke form)
  resetBtn.addEventListener('click', () => {
    // Bersihkan nilai input form
    leadForm.reset();
    
    // Aktifkan kembali input dan tombol
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    Object.keys(fields).forEach(key => {
      const field = fields[key];
      field.input.disabled = false;
      field.input.parentElement.classList.remove('invalid'); // Bersihkan sisa error
    });

    // Transisi kembali kartu
    successCard.classList.add('hidden');
    formCard.classList.remove('hidden');
    
    // Gulir ke form
    formCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});
