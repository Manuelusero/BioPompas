import express from 'express';
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Obtener el carrito del usuario
router.get('/', authenticateToken, getCart);

// Agregar un producto al carrito
router.post('/', authenticateToken, addToCart);

// Actualizar cantidad de un producto en el carrito
router.put('/:itemId', authenticateToken, updateCartItem);

// Eliminar un producto del carrito
router.delete('/:itemId', authenticateToken, removeFromCart);

// Vaciar el carrito
router.delete('/', authenticateToken, clearCart);

export default router;
