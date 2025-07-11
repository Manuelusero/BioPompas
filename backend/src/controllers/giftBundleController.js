import GiftBundle from '../models/GiftBundle.js';
import { readFile } from 'fs/promises';
import path from 'path';

export const getGiftBundles = async (req, res) => {
    try {
        const bundles = await GiftBundle.find();
        res.json(bundles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const preloadGiftBundles = async (req, res) => {
    try {
        const filePath = path.resolve('src/data/giftBundles.json');
        const data = await readFile(filePath, 'utf-8');
        const giftBundlesData = JSON.parse(data);
        await GiftBundle.deleteMany();
        await GiftBundle.insertMany(giftBundlesData);
        res.json({ message: 'Gift Bundles preloaded!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
