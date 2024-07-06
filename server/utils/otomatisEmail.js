// server/utils/otomatisEmail.js
import axios from 'axios';
import { DataAkun, Result, InformasiWeb } from '../model/DataAkunModel.js';
import cron from 'node-cron';
import dotenv from 'dotenv';
import sendWhatsappMessage from '../utils/sendWhatsappMessage.js';
import sendEmail from './sendEmail.js';

dotenv.config();

async function checkEmail(email) {
  try {
    const response = await axios.get(`https://haveibeenpwned.com/api/v3/breachedaccount/${email}`, {
      headers: {
        'hibp-api-key': process.env.HIBP_API_KEY,
        'user-agent': process.env.USER_AGENT,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return [];
    } else {
      throw error;
    }
  }
}

async function performChecks() {
  try {
    const akunList = await DataAkun.findAll({
      where: {
        status: 1,
      },
    });

    for (const akun of akunList) {
      const breaches = await checkEmail(akun.value);
      const status = breaches.length > 0 ? 1 : 0;
      const nextCheck = new Date();
      nextCheck.setDate(nextCheck.getDate() + akun.kurun_waktu_id * 15);

      await Result.create({
        data_akun_id: akun.id,
        hasil: status,
        whatsapp: akun.whatsapp,
        next_pengecekan: nextCheck,
      });

      if (status === 1) {
        for (const breach of breaches) {
          await InformasiWeb.create({
            data_akun_id: akun.id,
            website: breach.Name,
            keterangan: 1,
          });
        }

        // Kirim pesan WhatsApp
        const whatsappMessage = `Perhatian !!!\nEmail anda terkena breach pada beberapa situs tertentu. Silakan ambil tindakan segera. Lihat detailnya pada Beranda anda. Segera kembali ke KeyLock segera untuk mengamankan akun anda.\n\n-Team Keylock`;
        await sendWhatsappMessage(akun.whatsapp, whatsappMessage);

        // Kirim email
        const emailSubject = 'Peringatan Keamanan Akun KeyLock';
        const emailMessage = `Perhatian !!!\nEmail anda terkena breach pada beberapa situs tertentu. Silakan ambil tindakan segera. Lihat detailnya pada Beranda anda. Segera kembali ke KeyLock segera untuk mengamankan akun anda.\n\n-Team Keylock`;
        await sendEmail(akun.value, emailSubject, emailMessage);
      }

      await akun.update({
        status: 0,
      });
    }
    console.log('Pengecekan selesai.');
  } catch (error) {
    console.error('Terjadi kesalahan saat pengecekan:', error);
  }
}

async function checkResults() {
  try {
    const resultList = await Result.findAll({
      where: {
        next_pengecekan: new Date().toISOString().split('T')[0],
      },
    });

    for (const result of resultList) {
      const akun = await DataAkun.findByPk(result.data_akun_id);
      const breaches = await checkEmail(akun.value);
      const status = breaches.length > 0 ? 1 : 0;
      const nextCheck = new Date();
      nextCheck.setDate(nextCheck.getDate() + akun.kurun_waktu_id * 15);

      await result.update({
        hasil: status,
        next_pengecekan: nextCheck,
      });

      if (status === 1) {
        for (const breach of breaches) {
          await InformasiWeb.create({
            data_akun_id: akun.id,
            website: breach.Name,
            keterangan: 1,
          });
        }

        // Kirim pesan WhatsApp
        const whatsappMessage = `Perhatian !!!\nEmail anda terkena breach pada beberapa situs tertentu. Silakan ambil tindakan segera. Lihat detailnya pada Beranda anda. Segera kembali ke KeyLock segera untuk mengamankan akun anda.\n\n-Team Keylock`;
        await sendWhatsappMessage(akun.whatsapp, whatsappMessage);

        // Kirim email
        const emailSubject = 'Peringatan Keamanan Akun KeyLock';
        const emailMessage = `Perhatian !!!\nEmail anda terkena breach pada beberapa situs tertentu. Silakan ambil tindakan segera. Lihat detailnya pada Beranda anda. Segera kembali ke KeyLock segera untuk mengamankan akun anda.\n\n-Team Keylock`;
        await sendEmail(akun.value, emailSubject, emailMessage);
      }
    }
    console.log('Pengecekan otomatis selesai.');
  } catch (error) {
    console.error('Terjadi kesalahan saat pengecekan otomatis:', error);
  }
}

// Jadwalkan pengecekan setiap hari pada pukul 00:00
cron.schedule('0 0 * * *', () => {
  performChecks();
  checkResults();
  console.log('Scheduled checks performed.');
});

export { performChecks, checkResults };
