import { InformasiWeb, DataAkun } from '../model/DataAkunModel.js';

export const getBreachInfoByEmailAndWhatsApp = async (req, res) => {
  const { email, whatsapp } = req.body;

  try {
    // Cari data akun berdasarkan email dan nomor WhatsApp
    const akun = await DataAkun.findOne({
      where: {
        value: email,
        whatsapp: whatsapp
      }
    });

    if (!akun) {
      return res.status(404).json({ message: 'Data akun tidak ditemukan' });
    }

    // Cari semua informasi web yang terkait dengan akun tersebut
    const breachInfo = await InformasiWeb.findAll({
      where: {
        data_akun_id: akun.id
      }
    });

    if (breachInfo.length === 0) {
      return res.status(404).json({ message: 'Tidak ada informasi breach ditemukan untuk akun ini' });
    }

    // Kembalikan informasi web yang ditemukan
    return res.json({
      email: akun.value,
      whatsapp: akun.whatsapp,
      breaches: breachInfo.map(info => ({
        id: info.id,
        website: info.website,
        keterangan: info.keterangan,
      })),
    });

  } catch (error) {
    console.error('Terjadi kesalahan saat mendapatkan informasi breach:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const updateKeterangan = async (req, res) => {
  const { id, keterangan } = req.body;
  try {
      const result = await InformasiWeb.update(
          { keterangan },
          { where: { id } }
      );
      res.status(200).json({ message: 'Keterangan updated successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Error updating keterangan', error });
  }
};