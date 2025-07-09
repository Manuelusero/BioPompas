import express from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { getOrders, updateOrderStatus } from '../controllers/orderController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authorizeAdmin } from '../middleware/authorizeAdmin.js';

const router = express.Router();

// Rutas para administrar productos
router.get('/products', authenticateToken, authorizeAdmin, getProducts); // Ver todos los productos
router.post('/products', authenticateToken, authorizeAdmin, createProduct); // Crear producto
router.put('/products/:id', authenticateToken, authorizeAdmin, updateProduct); // Editar producto
router.delete('/products/:id', authenticateToken, authorizeAdmin, deleteProduct); // Eliminar producto

// Rutas para gestionar pedidos
router.get('/orders', authenticateToken, authorizeAdmin, getOrders); // Ver todos los pedidos
router.put('/orders/:id/status', authenticateToken, authorizeAdmin, updateOrderStatus); // Actualizar estado de pedido

export default router;
