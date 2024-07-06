import express from "express"
import { activateUser, deactivateUser, deleteAkun, deleteUser, getAllCheckingEmails, getAllUsers } from "../controller/adminController.js";

const router = express.Router();

router.get('/pengguna', getAllUsers);
router.get('/tampilkan-email', getAllCheckingEmails);
router.delete('/pengguna/:id', deleteUser);
router.delete('/tampilkan-email/:id', deleteAkun);
router.put('/pengguna/activate/:id', activateUser);
router.put('/pengguna/deactivate/:id', deactivateUser);

export default router;