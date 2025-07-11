import express from 'express';
import { getBlogs, preloadBlogs } from '../controllers/blogController.js';

const router = express.Router();

router.get('/', getBlogs);
router.post('/preload', preloadBlogs);

export default router;
