/**
 * Google Apps Script - HR Curated Insights Lead Automation
 * 
 * Script ini digunakan sebagai backend serverless untuk menerima data dari Landing Page,
 * mencatat data ke Google Sheets, dan secara otomatis mengirimkan email download link.
 * 
 * Panduan Setup lengkap ada di file SETUP_GUIDE.md
 */

// Konfigurasi Email
const CONFIG = {
  EMAIL_SUBJECT: "🎁 [Akses Gratis] HR Curated Insights Anda Telah Siap!",
  INSIGHT_LINK: "https://example.com/download/hr-curated-insights-2026.pdf", // GANTI dengan link PDF/Drive Anda
  SENDER_NAME: "HR Insight Team"
};

/**
 * Handler POST Request
 */
function doPost(e) {
  try {
    // Parser payload data dari request
    let data;
    if (e.postData.type === "application/json") {
      data = JSON.parse(e.postData.contents);
    } else {
      // Fallback jika dikirim via URL Encoded form
      data = e.parameter;
    }

    const timestamp = new Date();
    const nama = data.nama || "";
    const whatsapp = data.whatsapp || "";
    const email = data.email || "";
    const perusahaan = data.perusahaan || "";
    const jabatan = data.jabatan || "";

    // Validasi dasar
    if (!email) {
      return createResponse({
        status: "error",
        message: "Email wajib diisi."
      }, 400);
    }

    // 1. Tulis Data ke Google Sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Pastikan header ada jika sheet masih kosong
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Nama Lengkap", "Nomor WhatsApp", "Alamat Email", "Nama Perusahaan", "Jabatan / Posisi"]);
    }
    
    sheet.appendRow([timestamp, nama, whatsapp, email, perusahaan, jabatan]);

    // 2. Kirim Email Otomatis
    sendInsightEmail(email, nama);

    return createResponse({
      status: "success",
      message: "Data berhasil dicatat dan email insight telah dikirim!"
    }, 200);

  } catch (error) {
    Logger.log("Error: " + error.toString());
    return createResponse({
      status: "error",
      message: "Terjadi kesalahan pada server: " + error.toString()
    }, 500);
  }
}

/**
 * Handler preflight request untuk mengatasi masalah CORS
 */
function doOptions(e) {
  return HtmlService.createHtmlOutput("")
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .append("<script>window.parent.postMessage('CORS_OK', '*');</script>");
}

/**
 * Fungsi untuk Mengirim Email dengan Template HTML Premium
 */
function sendInsightEmail(recipientEmail, recipientName) {
  const emailHtml = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1a202c;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 28px; font-weight: bold; color: #4f46e5;">HR Insights</span>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 16px;">
      </div>
      
      <p style="font-size: 16px; line-height: 1.6; color: #4a5568;">Halo <strong>${recipientName || 'Kolega'}</strong>,</p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #4a5568;">
        Terima kasih telah mengisi formulir minat Anda. Berikut adalah produk **HR Curated Insights** yang Anda minta. Insight ini berisi kurasi data strategis, tren rekrutmen terbaru, serta strategi retensi talenta di tahun ini.
      </p>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${CONFIG.INSIGHT_LINK}" target="_blank" style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; text-decoration: none; padding: 14px 30px; font-size: 16px; font-weight: 600; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.4), 0 2px 4px -1px rgba(79, 70, 229, 0.06); display: inline-block; transition: all 0.2s;">
          🚀 Unduh HR Curated Insights Sekarang
        </a>
      </div>
      
      <p style="font-size: 14px; line-height: 1.5; color: #718096; text-align: center;">
        Jika tombol di atas tidak dapat diklik, Anda dapat menyalin tautan berikut ke browser Anda:<br>
        <a href="${CONFIG.INSIGHT_LINK}" style="color: #4f46e5; text-decoration: underline;">${CONFIG.INSIGHT_LINK}</a>
      </p>
      
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0 24px 0;">
      
      <p style="font-size: 14px; line-height: 1.6; color: #a0aec0; text-align: center;">
        Tautan ini dikirimkan secara otomatis dari sistem HR Insights.<br>
        © ${new Date().getFullYear()} ${CONFIG.SENDER_NAME}. All rights reserved.
      </p>
    </div>
  `;

  MailApp.sendEmail({
    to: recipientEmail,
    subject: CONFIG.EMAIL_SUBJECT,
    htmlBody: emailHtml,
    name: CONFIG.SENDER_NAME
  });
}

/**
 * Membuat Response JSON dengan CORS headers
 */
function createResponse(data, statusCode) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  
  // Mengembalikan output dengan header CORS
  return output;
}
