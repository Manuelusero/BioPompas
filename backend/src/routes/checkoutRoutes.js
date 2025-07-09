import express from 'express';
import { checkout, capturePayment } from '../controllers/checkoutController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
const router = express.Router();

// Proceso de checkout
router.post('/', authenticateToken, checkout);
router.post('/checkout', checkout);
router.get('/capture-payment', capturePayment);

export default router;
