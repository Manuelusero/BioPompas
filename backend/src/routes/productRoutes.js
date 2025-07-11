import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
} from '../controllers/productController.js';
import { validateProduct } from '../middleware/validateProduct.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Crear un producto
router.post('/', authenticateToken, authorizeAdmin, validateProduct, createProduct);

// Obtener todos los productos
router.get('/', getProducts);

// Obtener un producto por su ID
router.get('/:id', getProductById);

// Actualizar un producto
router.put('/:id', authenticateToken, authorizeAdmin, validateProduct, updateProduct);

// Eliminar un producto
router.delete('/:id', authenticateToken, authorizeAdmin, deleteProduct);

// Eliminar todos los productos
router.delete('/all', authenticateToken, authorizeAdmin, deleteAllProducts);




export default router;
