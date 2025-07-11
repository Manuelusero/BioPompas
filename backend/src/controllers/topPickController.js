import TopPick from "../models/TopPick.js";
import fs from "fs";
import path from "path";

export const preloadTopPicks = async (req, res) => {
    try {
        const dataPath = path.join(process.cwd(), "src/data/topPicks.json");
        const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
        await TopPick.deleteMany({});
        await TopPick.insertMany(data);
        res.status(200).json({ message: "Top Picks precargados correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al precargar Top Picks", error });
    }
};

export const getTopPicks = async (req, res) => {
    try {
        const picks = await TopPick.find();
        res.json(picks);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener Top Picks", error });
    }
};
