import Users from '../model/UserModel.js';
import { DataAkun, WaktuPengecekan } from '../model/DataAkunModel.js';
import Sequelize from 'sequelize';

// Function to get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ['id', 'fullname', 'email', 'status']
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllCheckingEmails = async (req, res) => {
    try {
        // Ambil semua data DataAkun
        const checkingEmails = await DataAkun.findAll({
            attributes: ['id', 'value', 'whatsapp', 'kurun_waktu_id', 'status'],
        });

        // Transformasi data untuk menggunakan kurun_waktu_id
        const result = checkingEmails.map(email => ({
            id: email.id,
            value: email.value,
            whatsapp: email.whatsapp,
            kurun_waktu: email.kurun_waktu_id, // Ambil langsung nilai kurun_waktu_id
            status: email.status === 1 ? 'Belum dilakukan pengecekan' : 'Sudah dilakukan pengecekan'
        }));

        res.json(result); // Kirimkan hasil dalam format JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // Tangani error jika terjadi
    }
};
// Function to soft delete a user
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await Users.destroy({ where: { id } });
        res.json({ message: 'User has been soft deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Function to soft delete an account
export const deleteAkun = async (req, res) => {
    try {
        const { id } = req.params;
        await DataAkun.destroy({ where: { id } });
        res.json({ message: 'Account has been soft deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Function to activate a user
export const activateUser = async (req, res) => {
    try {
        const { id } = req.params;
        await Users.update({ status: 1 }, { where: { id } });
        res.json({ message: 'User has been activated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Function to deactivate a user
export const deactivateUser = async (req, res) => {
    try {
        const { id } = req.params;
        await Users.update({ status: 0 }, { where: { id } });
        res.json({ message: 'User has been deactivated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
