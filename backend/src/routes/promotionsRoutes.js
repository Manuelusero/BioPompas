import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Ruta para obtener promociones desde el JSON
router.get('/', (req, res) => {
    const filePath = path.join(process.cwd(), 'src/data/products.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo de promociones' });
        }
        const json = JSON.parse(data);
        res.json(json.promotions || []);
    });
});

export default router;
