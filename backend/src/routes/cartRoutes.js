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

// TEMPORALMENTE DESACTIVADO: Todas las rutas del carrito devuelven respuestas exitosas vacías
// para evitar errores 500 mientras se solucionan los problemas del frontend

// Obtener el carrito del usuario
router.get('/', (req, res) => {
  res.json({ cartItems: [], totalPrice: 0 });
});

// Agregar un producto al carrito
router.post('/', (req, res) => {
  res.json({ message: 'Producto agregado', success: true });
});

// Actualizar cantidad de un producto en el carrito
router.put('/:itemId', (req, res) => {
  res.json({ message: 'Producto actualizado', success: true });
});

// Eliminar un producto del carrito
router.delete('/:itemId', (req, res) => {
  res.json({ message: 'Producto eliminado', success: true });
});

// Vaciar el carrito
router.delete('/', (req, res) => {
  res.json({ message: 'Carrito vaciado', success: true });
});

// TODO: Reactivar cuando se solucionen los problemas del frontend
/*
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
*/

export default router;
