import OurStore from "../models/OurStore.js";
import fs from "fs";
import path from "path";

export const preloadOurStore = async (req, res) => {
    try {
        const dataPath = path.join(process.cwd(), "src/data/ourStore.json");
        const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
        await OurStore.deleteMany({});
        await OurStore.insertMany(data);
        res.status(200).json({ message: "Our Store precargado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al precargar Our Store", error });
    }
};

export const getOurStore = async (req, res) => {
    try {
        const stores = await OurStore.find();
        res.json(stores);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener Our Store", error });
    }
};
