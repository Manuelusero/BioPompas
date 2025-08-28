import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Ruta para obtener promociones desde el JSON
router.get('/', (req, res) => {
    try {
        const filePath = path.join(process.cwd(), 'src/data/products.json');

        if (!fs.existsSync(filePath)) {
            console.log('products.json no encontrado, devolviendo array vacío');
            return res.json([]);
        }

        const data = fs.readFileSync(filePath, 'utf8');
        const json = JSON.parse(data);
        const promotions = json.promotions || [];
        res.json(promotions);
    } catch (error) {
        console.error('Error reading promotions:', error);
        res.status(500).json({ error: 'Error al leer el archivo de promociones' });
    }
});

export default router;
