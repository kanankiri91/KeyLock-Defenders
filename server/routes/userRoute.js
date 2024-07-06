// routes/userRoute.js
import express from "express";
import { Register, getUserById, getUsers, updateUser } from "../controller/UserController.js";
import { verifyUser } from "../middleware/AuthUser.js";
import { dataPemeriksaanAkun } from "../controller/pemeriksaan.js";
import { checkUrl } from "../controller/pengecekanURL.js";
import { checkEmail } from "../controller/periksaEmail.js";
import { performChecks, checkResults } from "../utils/otomatisEmail.js";
import { getBreachInfoByEmailAndWhatsApp, updateKeterangan } from "../controller/breachInfoController.js";
import { getUserProfile, updateEmail, updateFullname, updatePassword } from "../controller/UserProfileController.js";

const router = express.Router();

router.get('/users', verifyUser, getUsers);
router.post('/daftar', Register);
router.post('/masukkan-data', verifyUser, dataPemeriksaanAkun);
router.post('/cek-url', checkUrl);
router.post('/cek-email', checkEmail);
router.post('/breach-info', getBreachInfoByEmailAndWhatsApp); 
router.put('/update-keterangan', updateKeterangan)

router.get('/profile', verifyUser, getUserProfile);
router.put('/profile/fullname', verifyUser, updateFullname);
router.put('/profile/email', verifyUser, updateEmail);
router.put('/profile/password', verifyUser, updatePassword);


router.get('/pengecekan', async (req, res) => {
  try {
    await performChecks();
    await checkResults();
    res.send('Pengecekan selesai.');
  } catch (error) {
    res.status(500).send('Terjadi kesalahan saat pengecekan.');
  }
});

export default router;
