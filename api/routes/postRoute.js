import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { create, getposts, deletepost } from '../controllers/postController.js';

const router = express.Router();

router.post('/create', verifyToken, create)
router.get('/getposts', getposts)
router.get('/deletepost/:postId/:userid', verifyToken, deletepost)


export default router;