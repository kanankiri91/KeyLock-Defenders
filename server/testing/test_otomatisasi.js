import axios from 'axios';
import { DataAkun, Result, InformasiWeb } from '../model/DataAkunModel.js';
import cron from 'node-cron';
import dotenv from 'dotenv';
import sendWhatsappMessage from '../utils/sendWhatsappMessage.js';
import sendEmail from './sendEmail.js';
import fs from 'fs';

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
      // Percepat nextCheck menjadi 1 menit ke depan untuk simulasi
      nextCheck.setMinutes(nextCheck.getMinutes() + 1);

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

        const whatsappMessage = `Perhatian !!!\nEmail anda terkena breach pada beberapa situs tertentu. Silakan ambil tindakan segera. Lihat detailnya pada Beranda anda. Segera kembali ke KeyLock segera untuk mengamankan akun anda.\n\n-Team Keylock`;
        await sendWhatsappMessage(akun.whatsapp, whatsappMessage);

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
      // Percepat nextCheck menjadi 1 menit ke depan untuk simulasi
      nextCheck.setMinutes(nextCheck.getMinutes() + 1);

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

        const whatsappMessage = `Perhatian !!!\nEmail anda terkena breach pada beberapa situs tertentu. Silakan ambil tindakan segera. Lihat detailnya pada Beranda anda. Segera kembali ke KeyLock segera untuk mengamankan akun anda.\n\n-Team Keylock`;
        await sendWhatsappMessage(akun.whatsapp, whatsappMessage);

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

async function checkInformasiWeb() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const resultList = await Result.findAll({
      where: {
        next_pengecekan: today,
      },
    });

    for (const result of resultList) {
      const dataAkunId = result.data_akun_id;
      const informasiWebList = await InformasiWeb.findAll({
        where: {
          data_akun_id: dataAkunId,
        },
      });

      const isBreached = informasiWebList.some(info => info.keterangan === 1);

      const dataAkun = await DataAkun.findByPk(dataAkunId);

      if (isBreached) {
        const breachMessage = `Perhatian !!!\nEmail anda terkena breach pada beberapa situs tertentu. Silakan ambil tindakan segera. Lihat detailnya pada Beranda anda. Segera kembali ke KeyLock segera untuk mengamankan akun anda.\n\n-Team Keylock`;
        await sendWhatsappMessage(dataAkun.whatsapp, breachMessage);

        const emailSubject = 'Peringatan Keamanan Akun KeyLock';
        const emailMessage = breachMessage;
        await sendEmail(dataAkun.value, emailSubject, emailMessage);
      } else {
        const safeMessage = `Pengecekan telah dilakukan. Email anda sampai saat ini masih aman.\n\n-Team Keylock`;
        await sendWhatsappMessage(dataAkun.whatsapp, safeMessage);

        const emailSubject = 'Pemberitahuan Keamanan Akun KeyLock';
        const emailMessage = safeMessage;
        await sendEmail(dataAkun.value, emailSubject, emailMessage);
      }
    }

    console.log('Pengecekan informasi web selesai.');
  } catch (error) {
    console.error('Terjadi kesalahan saat pengecekan informasi web:', error);
  }
}

function logToFile(message) {
  const logMessage = `${new Date().toISOString()} - ${message}\n`;
  fs.appendFileSync('simulation_log.txt', logMessage);
}

function simulateScheduledChecks() {
  console.log('Scheduled check started.');
  logToFile('Scheduled check started.');

  setInterval(async () => {
    console.log('Performing scheduled checks...');
    logToFile('Performing scheduled checks...');
    await performChecks();
    console.log('performChecks completed.');
    logToFile('performChecks completed.');
    await checkResults();
    console.log('checkResults completed.');
    logToFile('checkResults completed.');
    await checkInformasiWeb();
    console.log('checkInformasiWeb completed.');
    logToFile('checkInformasiWeb completed.');
    console.log('Scheduled check completed.');
    logToFile('Scheduled check completed.');
  }, 60000); // Simulasikan pengecekan setiap menit
}

simulateScheduledChecks();

export { performChecks, checkResults, checkInformasiWeb };
