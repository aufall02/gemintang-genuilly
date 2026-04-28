/**
 * ═══════════════════════════════════════════════════════════
 *  GOOGLE APPS SCRIPT – PENJELAJAH KEANEKARAGAMAN HAYATI
 *  Cara deploy:
 *  1. Buka Google Sheets baru
 *  2. Extensions → Apps Script
 *  3. Paste kode ini
 *  4. Deploy → New Deployment → Web App
 *  5. Execute as: Me | Who has access: Anyone
 *  6. Deploy → Copy URL → paste ke game.html (APPS_SCRIPT_URL)
 * ═══════════════════════════════════════════════════════════
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Buat header kalau sheet masih kosong
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'No', 'Timestamp', 'Nama', 'Kelas',
        'Skor Penyisihan', 'Skor Level 1', 'Skor Level 2', 'Skor Level 3',
        'Total Skor', 'Predikat'
      ]);

      // Style header
      const header = sheet.getRange(1, 1, 1, 10);
      header.setBackground('#1a6b3a');
      header.setFontColor('#ffffff');
      header.setFontWeight('bold');
      header.setHorizontalAlignment('center');
      sheet.setFrozenRows(1);
    }

    const data = JSON.parse(e.postData.contents);
    const total = parseInt(data.totalSkor) || 0;

    // Tentukan predikat
    let predikat = '';
    if      (total >= 360) predikat = '🏆 PENJELAJAH AHLI';
    else if (total >= 280) predikat = '🌟 PENJELAJAH MUDA';
    else if (total >= 200) predikat = '👍 PENJELAJAH PEMULA';
    else                   predikat = '📚 PERLU BELAJAR LAGI';

    const no = sheet.getLastRow(); // row sebelumnya = nomor urut
    const timestamp = new Date().toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      dateStyle: 'short',
      timeStyle: 'short'
    });

    sheet.appendRow([
      no,
      timestamp,
      data.nama    || '-',
      data.kelas   || '-',
      parseInt(data.skorPenyisihan) || 0,
      parseInt(data.skorLevel1)     || 0,
      parseInt(data.skorLevel2)     || 0,
      parseInt(data.skorLevel3)     || 0,
      total,
      predikat
    ]);

    // Auto-resize kolom
    sheet.autoResizeColumns(1, 10);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', pesan: 'Skor berhasil disimpan!' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', pesan: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test manual (jalankan dari Apps Script editor)
function testManual() {
  const fakeEvent = {
    postData: {
      contents: JSON.stringify({
        nama: 'Budi Santoso',
        kelas: 'VII-A',
        skorPenyisihan: 80,
        skorLevel1: 70,
        skorLevel2: 80,
        skorLevel3: 60,
        totalSkor: 290
      })
    }
  };
  const hasil = doPost(fakeEvent);
  Logger.log(hasil.getContent());
}
