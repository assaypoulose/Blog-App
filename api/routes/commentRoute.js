import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { createComment, getPostComments } from '../controllers/commentController.js';


const router = express.Router();


router.post('/create', verifyToken, createComment);
router.get('/getPostComments/:postId', getPostComments);



export default router;
