import Users from '../model/UserModel.js';
import { DataAkun, InformasiWeb } from '../model/DataAkunModel.js';
import jwt from 'jsonwebtoken';
import argon2 from "argon2";

// Get user profile information
export const getUserProfile = async (req, res) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is missing' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    // Verifikasi token JWT dan dapatkan id dari payload
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const akunId = decoded.userId; // Ubah menjadi userId sesuai dengan payload JWT

    console.log('Decoded JWT:', decoded);

    if (!akunId) {
      return res.status(400).json({ message: 'Invalid token payload' });
    }

    // Dapatkan data pengguna berdasarkan akun_id termasuk informasi web
    const userProfile = await Users.findOne({
      where: { id: akunId },
      attributes: ['id', 'username', 'fullname', 'email'],
      include: {
        model: DataAkun,
        as: 'data_akuns',
        attributes: ['id', 'value', 'whatsapp'],
        include: {
          model: InformasiWeb,
          as: 'informasi_webs',
          attributes: ['id', 'website', 'keterangan'],
        },
      },
    });

    if (!userProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Ambil seluruh value dari tabel data_akun yang terkait dengan akun yang login
    const dataAkunValues = await DataAkun.findAll({
      where: { akun_id: akunId },
      include: {
        model: InformasiWeb,
        as: 'informasi_webs',
        attributes: ['id', 'website', 'keterangan'],
      },
    });

    res.status(200).json({ userProfile, dataAkunValues });
  } catch (error) {
    console.error('Error fetching profile data:', error);
    res.status(500).json({ message: 'Error fetching profile data', error });
  }
};

export const updateFullname = async (req, res) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is missing' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.userId; // Ambil userId dari token JWT

    if (!userId) {
      return res.status(400).json({ message: 'Invalid token payload' });
    }

    const user = await Users.findByPk(userId); // Cari pengguna berdasarkan userId
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fullname berdasarkan userId
    await Users.update({ fullname: req.body.fullname }, {
      where: { id: userId }
    });

    res.json({ msg: "Fullname updated" });
  } catch (error) {
    console.error('Error updating fullname:', error);
    res.status(500).json({ msg: error.message });
  }
};

export const updateEmail = async (req, res) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is missing' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.userId; // Ambil userId dari token JWT

    if (!userId) {
      return res.status(400).json({ message: 'Invalid token payload' });
    }

    const user = await Users.findByPk(userId); // Cari pengguna berdasarkan userId
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update email berdasarkan userId
    await Users.update({ email: req.body.email }, {
      where: { id: userId }
    });

    res.json({ msg: "Email updated" });
  } catch (error) {
    console.error('Error updating email:', error);
    res.status(500).json({ msg: error.message });
  }
};
export const updatePassword = async (req, res) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is missing' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.userId; // Ambil userId dari token JWT

    if (!userId) {
      return res.status(400).json({ message: 'Invalid token payload' });
    }

    const user = await Users.findByPk(userId); // Cari pengguna berdasarkan userId
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const match = await argon2.verify(user.password, req.body.oldPassword);
    if (!match) {
      return res.status(400).json({ msg: "Incorrect old password" });
    }

    const hashPassword = await argon2.hash(req.body.newPassword);
    await Users.update({ password: hashPassword }, {
      where: { id: userId }
    });

    res.json({ msg: "Password updated" });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ msg: error.message });
  }
};
