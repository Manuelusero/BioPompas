import express from 'express';
import { getGiftBundles, preloadGiftBundles } from '../controllers/giftBundleController.js';

const router = express.Router();

router.get('/', getGiftBundles);
router.post('/preload', preloadGiftBundles);

export default router;
