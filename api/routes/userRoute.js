import express from "express";
import { signup, signin, google, updateUser, deleteUser } from "../controllers/userController.js";
import { verifyToken } from '../middleware/auth.js'

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google); //signin using google account
router.put('/update/:userId', verifyToken, updateUser)
router.delete('/delete/:userId', verifyToken, deleteUser);
    

export default router;