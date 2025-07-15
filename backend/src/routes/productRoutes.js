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

// Obtener productos por categoría (soporta múltiples categorías y espacios)
router.get('/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    // Busca productos donde la categoría contenga la palabra buscada (insensible a mayúsculas/minúsculas)
    const products = await Product.find({
      category: { $regex: new RegExp(`(^|,\s*)${category}(,|$)`, 'i') }
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos por categoría' });
  }
});

// --- DESACTIVAR TEMPORALMENTE LA VERIFICACIÓN DE EMAIL PARA DESARROLLO ---
// Si existe el middleware verifyEmailMiddleware, comentar su uso en las rutas de auth o registro.
// Esto debe hacerse en el archivo de rutas correspondiente (probablemente authRoutes.js).

export default router;
