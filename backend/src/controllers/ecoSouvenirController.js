import EcoSouvenir from "../models/EcoSouvenir.js";
import fs from "fs";
import path from "path";

export const preloadEcoSouvenirs = async (req, res) => {
    try {
        const dataPath = path.join(process.cwd(), "src/data/ecoSouvenirs.json");
        const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
        await EcoSouvenir.deleteMany({});
        await EcoSouvenir.insertMany(data);
        res.status(200).json({ message: "Eco Souvenirs precargados correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al precargar Eco Souvenirs", error });
    }
};

export const getEcoSouvenirs = async (req, res) => {
    try {
        const souvenirs = await EcoSouvenir.find();
        res.json(souvenirs);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener Eco Souvenirs", error });
    }
};
