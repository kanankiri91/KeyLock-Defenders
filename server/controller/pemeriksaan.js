import { DataAkun } from '../model/DataAkunModel.js';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

export const dataPemeriksaanAkun = async (req, res) => {
    const { email, whatsapp, selectedOption } = req.body;
    const token = req.header('Authorization').replace('Bearer ', '');

    try {
        // Verifikasi token JWT dan dapatkan id dari payload
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const akunId = decoded.userId; // Pastikan menggunakan userId dari decoded token

        // Cek apakah email sudah pernah dimasukkan sebelumnya
        const existingDataAkun = await DataAkun.findOne({ where: { value: email } });
        if (existingDataAkun) {
            return res.status(400).json({ message: 'Email sudah terdaftar' });
        }

        // Tambahkan kode negara Indonesia (+62) ke nomor WhatsApp
        const formattedWhatsapp = `+62${whatsapp}`;

        // Buat entri baru di tabel DataAkun dengan akun_id yang sudah didefinisikan
        const newDataAkun = await DataAkun.create({
            objek_id: 1,
            value: email,
            whatsapp: formattedWhatsapp,
            kurun_waktu_id: selectedOption,
            akun_id: akunId  // Isi akun_id dengan userId yang diperoleh dari JWT
        });

        res.status(201).json({ message: 'Data akun berhasil dibuat', data: newDataAkun });
    } catch (error) {
        console.error('Error creating data akun:', error);
        res.status(500).json({ message: 'Error saat membuat data akun', error });
    }
};
