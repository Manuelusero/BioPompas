import express from 'express';
import { getEcoBottles, preloadEcoBottles } from '../controllers/ecoBottleController.js';

const router = express.Router();

router.get('/', getEcoBottles);
router.post('/preload', preloadEcoBottles);

export default router;
