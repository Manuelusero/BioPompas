import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

router.get("/", (req, res) => {
    try {
        const dataPath = path.join(process.cwd(), "src/data/ourStore.json");

        if (!fs.existsSync(dataPath)) {
            console.log('ourStore.json no encontrado, devolviendo array vacío');
            return res.json([]);
        }

        const rawData = fs.readFileSync(dataPath, "utf-8");
        const ourStore = JSON.parse(rawData);
        res.json(ourStore);
    } catch (error) {
        console.error('Error reading ourStore:', error);
        res.status(500).json({ error: "Error al leer ourStore.json" });
    }
});

export default router;
