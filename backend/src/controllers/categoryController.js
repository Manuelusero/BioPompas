import Category from "../models/Category.js";
import fs from "fs";
import path from "path";

export const preloadCategories = async (req, res) => {
    try {
        const dataPath = path.join(process.cwd(), "src/data/categories.json");
        const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
        await Category.deleteMany({});
        await Category.insertMany(data);
        res.status(200).json({ message: "Categories precargadas correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al precargar Categories", error });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener Categories", error });
    }
};
