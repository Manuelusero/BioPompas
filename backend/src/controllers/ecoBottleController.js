import EcoBottle from '../models/EcoBottle.js';
import { readFile } from 'fs/promises';
import path from 'path';

export const getEcoBottles = async (req, res) => {
    try {
        const bottles = await EcoBottle.find();
        res.json(bottles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const preloadEcoBottles = async (req, res) => {
    try {
        const filePath = path.resolve('src/data/ecoBottles.json');
        const data = await readFile(filePath, 'utf-8');
        const ecoBottlesData = JSON.parse(data);
        await EcoBottle.deleteMany();
        await EcoBottle.insertMany(ecoBottlesData);
        res.json({ message: 'Eco Bottles preloaded!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
