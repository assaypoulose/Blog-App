import express from "express";
import { signup, signin, google, updateUser } from "../controllers/userController.js";
import { verifyToken } from '../middleware/auth.js'

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google); //signin using google account
router.put('/update/:userId', verifyToken, updateUser)
    

export default router;