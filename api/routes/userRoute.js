import express from "express";
import { signup, signin, google, updateUser, deleteUser, signout, getUsers } from "../controllers/userController.js";
import { verifyToken } from '../middleware/auth.js'

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google); //signin using google account
router.put('/update/:userId', verifyToken, updateUser)
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', signout);
router.get('/getusers', verifyToken, getUsers);
    

export default router;