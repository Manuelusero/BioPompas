import express from 'express';
import fs from "fs";
import path from "path";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // Intentar MongoDB primero
        try {
            const Blog = (await import('../models/Blog.js')).default;
            const blogs = await Blog.find({});
            if (blogs && blogs.length > 0) {
                return res.json(blogs);
            }
        } catch (mongoError) {
            console.log('MongoDB no disponible, usando JSON fallback');
        }

        // Fallback a archivo JSON
        const dataPath = path.join(process.cwd(), "src/data/blogs.json");
        if (fs.existsSync(dataPath)) {
            const rawData = fs.readFileSync(dataPath, "utf-8");
            const blogs = JSON.parse(rawData);
            return res.json(blogs);
        }

        // Si no hay datos, devolver array vacío
        res.json([]);

    } catch (error) {
        console.error('Error en blogRoutes:', error);
        res.status(500).json({
            error: "Error al obtener blogs",
            message: error.message
        });
    }
});

export default router;