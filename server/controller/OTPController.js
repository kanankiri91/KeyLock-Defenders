// Import library yang diperlukan
import moment from 'moment-timezone';
import argon2 from 'argon2';

// Import model dan utilitas yang dibutuhkan
import { OTP } from '../model/DataAkunModel.js';
import Users from '../model/UserModel.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';

// Generate random OTP
const generateOtp = () => {
  return crypto.randomBytes(3).toString('hex');
};

// Fungsi untuk request OTP
export const requestOtp = async (req, res) => {
  const { email } = req.body;

  try {
    // Cari user berdasarkan email
    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Generate OTP
    const otp = generateOtp();
    const expiresAt = moment().tz('Asia/Jakarta').add(15, 'minutes'); // OTP berlaku selama 15 menit

    // Simpan OTP ke database
    await OTP.create({
      user_id: user.id,
      otp,
      expires_at: expiresAt.toDate(), // Konversi moment ke Date untuk menyimpan ke database
    });

    // Kirim OTP via email
    await sendEmail(email, 'Kode OTP untuk Reset Password', `Kode OTP Anda adalah ${otp}`);

    res.status(200).json({ message: 'Kode OTP telah dikirim ke email Anda' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};

// Fungsi untuk verifikasi OTP dan reset password
export const verifyOtpAndResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Cari user berdasarkan email
    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Cari OTP record yang sesuai
    const otpRecord = await OTP.findOne({
      where: {
        user_id: user.id,
        otp,
      },
    });

    // Periksa apakah OTP record ditemukan dan masih berlaku
    if (!otpRecord || moment().tz('Asia/Jakarta').isAfter(moment(otpRecord.expires_at))) {
      console.log('Current Date:', moment().tz('Asia/Jakarta').format());
      console.log('otpRecord.expires_at:', moment(otpRecord.expires_at).tz('Asia/Jakarta').format());
      return res.status(400).json({ message: 'Kode OTP tidak valid atau telah kedaluwarsa' });
    }

    // Hash password baru menggunakan argon2
    const hashedPassword = await argon2.hash(newPassword);

    // Update password user
    await Users.update({ password: hashedPassword }, { where: { id: user.id } });

    // Hapus OTP setelah digunakan
    await OTP.destroy({ where: { id: otpRecord.id } });

    // Response sukses
    res.status(200).json({ message: 'Password berhasil direset' });
  } catch (error) {
    // Tangani error
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};
