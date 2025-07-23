import express from 'express';
import fs from "fs";
import path from "path";

const router = express.Router();

router.get('/', (req, res) => {
    const dataPath = path.join(process.cwd(), "src/data/blogs.json");
    try {
        const rawData = fs.readFileSync(dataPath, "utf-8");
        const blogs = JSON.parse(rawData);
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: "Error al leer blogs.json" });
    }
});

export default router;
