import express from 'express';
import Product from '../models/Product.js'; // <-- IMPORTACIÓN CORRECTA DEL MODELO
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

// Obtener productos (ruta pública)
router.get('/', getProducts);

// Crear producto (solo administrador)
router.post('/', authenticateToken, authorizeAdmin, validateProduct, createProduct);

// Actualizar producto (solo administrador)
router.put('/:id', authenticateToken, authorizeAdmin, validateProduct, updateProduct);

// Eliminar producto (solo administrador)
router.delete('/:id', authenticateToken, authorizeAdmin, deleteProduct);

// Eliminar todos los productos
router.delete('/all', authenticateToken, authorizeAdmin, deleteAllProducts);

// Obtener un producto por su ID
router.get('/:id', getProductById);

// Obtener productos por categoría (coincidencia robusta, ignora espacios y mayúsculas)
router.get('/category/:category', async (req, res) => {
  try {
    const categoryParam = req.params.category.trim().toLowerCase();
    // Filtra productos que tengan la categoría exacta (ignorando espacios y mayúsculas)
    const products = await Product.find({
      $expr: {
        $in: [
          categoryParam,
          {
            $map: {
              input: { $split: ["$category", ","] },
              as: "cat",
              in: { $trim: { input: { $toLower: "$$cat" } } }
            }
          }
        ]
      }
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
