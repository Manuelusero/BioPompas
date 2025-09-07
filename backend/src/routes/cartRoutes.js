import express from 'express';
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  syncCart,
} from '../controllers/cartController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Obtener el carrito del usuario o anónimo
router.get('/', getCart);

// Agregar un producto al carrito (usuario o anónimo)
router.post('/', addToCart);

// Sincronizar carrito de localStorage con backend (requiere login)
router.post('/sync', authenticateToken, syncCart);

// Actualizar cantidad de un producto en el carrito
router.put('/:itemId', updateCartItem);

// Eliminar un producto del carrito
router.delete('/:productId', removeFromCart);

// Vaciar el carrito
router.delete('/', clearCart);

export default router;
