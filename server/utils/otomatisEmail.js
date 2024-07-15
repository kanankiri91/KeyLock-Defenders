import axios from 'axios';
import { DataAkun, Result, InformasiWeb } from '../model/DataAkunModel.js';
import Users from '../model/UserModel.js';
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
      }
    });

    for (const akun of akunList) {
      console.log('Akun:', akun);

      const user = await Users.findOne({ where: { id: akun.akun_id } });
      const emailTarget = user.email; // Dapatkan email dari tabel Users

      const breaches = await checkEmail(akun.value);
      const status = breaches.length > 0 ? 1 : 0;
      const nextCheck = new Date();
      nextCheck.setDate(nextCheck.getDate() + akun.kurun_waktu_id * 15);

      const result = await Result.create({
        data_akun_id: akun.id,
        hasil: status,
        whatsapp: akun.whatsapp,
        next_pengecekan: nextCheck,
      });

      let newBreachAdded = false;
      if (status === 1) {
        for (const breach of breaches) {
          // Cek apakah entri dengan data_akun_id dan nama website yang sama sudah ada
          const existingInfo = await InformasiWeb.findOne({
            where: {
              data_akun_id: akun.id,
              website: breach.Name,
            },
          });

          // Jika belum ada, tambahkan entri baru
          if (!existingInfo) {
            await InformasiWeb.create({
              data_akun_id: akun.id,
              website: breach.Name,
              keterangan: 1,
            });
            newBreachAdded = true;
          }
        }

        // Kirim pesan WhatsApp
        const whatsappMessage = `Perhatian !!!\nEmail anda terkena breach pada beberapa situs tertentu. Silakan ambil tindakan segera. Lihat detailnya pada Beranda anda. Segera kembali ke KeyLock segera untuk mengamankan akun anda.\n\n-Team Keylock`;
        await sendWhatsappMessage(akun.whatsapp, whatsappMessage);
        console.log(`WhatsApp message sent to ${akun.whatsapp}`);

        // Kirim email
        const emailSubject = 'Peringatan Keamanan Akun KeyLock';
        const emailMessage = `Perhatian !!!\nEmail anda terkena breach pada beberapa situs tertentu. Silakan ambil tindakan segera. Lihat detailnya pada Beranda anda. Segera kembali ke KeyLock segera untuk mengamankan akun anda.\n\n-Team Keylock`;
        await sendEmail(emailTarget, emailSubject, emailMessage);
        console.log(`Email sent to ${emailTarget}`);
      }

      if (!newBreachAdded) {
        const informasiWebList = await InformasiWeb.findAll({
          where: {
            data_akun_id: akun.id,
          },
        });

        console.log('Informasi Web List:', informasiWebList);

        const allSafe = informasiWebList.every(info => info.keterangan === 0);

        console.log('All Safe:', allSafe);

        if (allSafe) {
          const emailSubject = 'Pemberitahuan Keamanan Akun KeyLock';
          const emailMessage = `Pengecekan telah dilaksanakan tidak ada kejadian mencurigakan pada email anda. Selamat menjalani aktifitas dan tetap jaga keamanan anda.\n\n-Team Keylock`;
          await sendEmail(emailTarget, emailSubject, emailMessage);
          console.log(`Email sent to ${emailTarget} stating no suspicious activity found.`);
        }
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
      }
    });

    for (const result of resultList) {
      const akun = result.data_akun;
      const user = await Users.findOne({ where: { id: akun.akun_id } });
      const emailTarget = user.email; // Dapatkan email dari tabel Users

      const breaches = await checkEmail(akun.value);
      const status = breaches.length > 0 ? 1 : 0;
      const nextCheck = new Date();
      nextCheck.setDate(nextCheck.getDate() + akun.kurun_waktu_id * 15);

      await result.update({
        hasil: status,
        next_pengecekan: nextCheck,
      });

      let newBreachAdded = false;
      if (status === 1) {
        for (const breach of breaches) {
          // Cek apakah entri dengan data_akun_id dan nama website yang sama sudah ada
          const existingInfo = await InformasiWeb.findOne({
            where: {
              data_akun_id: akun.id,
              website: breach.Name,
            },
          });

          // Jika belum ada, tambahkan entri baru
          if (!existingInfo) {
            await InformasiWeb.create({
              data_akun_id: akun.id,
              website: breach.Name,
              keterangan: 1,
            });
            newBreachAdded = true;
          }
        }

        // Kirim pesan WhatsApp
        const whatsappMessage = `Perhatian !!!\nEmail anda terkena breach pada beberapa situs tertentu. Silakan ambil tindakan segera. Lihat detailnya pada Beranda anda. Segera kembali ke KeyLock segera untuk mengamankan akun anda.\n\n-Team Keylock`;
        await sendWhatsappMessage(akun.whatsapp, whatsappMessage);
        console.log(`WhatsApp message sent to ${akun.whatsapp}`);

        // Kirim email
        const emailSubject = 'Peringatan Keamanan Akun KeyLock';
        const emailMessage = `Perhatian !!!\nEmail anda terkena breach pada beberapa situs tertentu. Silakan ambil tindakan segera. Lihat detailnya pada Beranda anda. Segera kembali ke KeyLock segera untuk mengamankan akun anda.\n\n-Team Keylock`;
        await sendEmail(emailTarget, emailSubject, emailMessage);
        console.log(`Email sent to ${emailTarget}`);
      }

      if (!newBreachAdded) {
        const informasiWebList = await InformasiWeb.findAll({
          where: {
            data_akun_id: akun.id,
          },
        });

        const allSafe = informasiWebList.every(info => info.keterangan === 0);

        if (allSafe) {
          const emailSubject = 'Pemberitahuan Keamanan Akun KeyLock';
          const emailMessage = `Pengecekan telah dilaksanakan tidak ada kejadian mencurigakan pada email anda. Selamat menjalani aktifitas dan tetap jaga keamanan anda.\n\n-Team Keylock`;
          await sendEmail(emailTarget, emailSubject, emailMessage);
          console.log(`Email sent to ${emailTarget} stating no suspicious activity found.`);
        }
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

      console.log('Informasi Web List:', informasiWebList);

      const hasBreach = informasiWebList.some(info => info.keterangan === 1);
      const allSafe = informasiWebList.every(info => info.keterangan === 0);

      console.log('Has Breach:', hasBreach);
      console.log('All Safe:', allSafe);

      const dataAkun = await DataAkun.findByPk(dataAkunId);
      const user = await Users.findOne({ where: { id: dataAkun.akun_id } });
      const emailTarget = user.email; // Dapatkan email dari tabel Users

      if (hasBreach) {
        const breachMessage = `Perhatian !!!\nEmail anda terkena breach pada beberapa situs tertentu. Silakan ambil tindakan segera. Lihat detailnya pada Beranda anda. Segera kembali ke KeyLock segera untuk mengamankan akun anda.\n\n-Team Keylock`;
        
        // Kirim pesan WhatsApp
        await sendWhatsappMessage(dataAkun.whatsapp, breachMessage);
        console.log(`WhatsApp message sent to ${dataAkun.whatsapp}`);

        // Kirim email
        const emailSubject = 'Peringatan Keamanan Akun KeyLock';
        const emailMessage = breachMessage;
        await sendEmail(emailTarget, emailSubject, emailMessage);
        console.log(`Email sent to ${emailTarget}`);
      } else if (allSafe) {
        const safeMessage = `Pengecekan telah dilaksanakan tidak ada kejadian mencurigakan pada email anda. Selamat menjalani aktifitas dan tetap jaga keamanan anda.\n\n-Team Keylock`;
        // Kirim email
        const emailSubject = 'Pemberitahuan Keamanan Akun KeyLock';
        const emailMessage = safeMessage;
        await sendEmail(emailTarget, emailSubject, emailMessage);
        console.log(`Email sent to ${emailTarget} stating no suspicious activity found.`);
      }
    }
    console.log('Pengecekan tabel informasi_web selesai.');
  } catch (error) {
    console.error('Terjadi kesalahan saat pengecekan tabel informasi_web:', error);
  }
}

// Jadwalkan pengecekan tiga kali sehari pada pukul 00:00, 08:00, dan 16:00
cron.schedule('0 0,8,16 * * *', () => {
  performChecks();
  checkResults();
  checkInformasiWeb();
  console.log('Scheduled checks performed.');
});

export { performChecks, checkResults, checkInformasiWeb };
