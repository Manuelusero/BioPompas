import Blog from '../models/Blog.js';
import { readFile } from 'fs/promises';
import path from 'path';

export const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const preloadBlogs = async (req, res) => {
    try {
        const filePath = path.resolve('src/data/blogs.json');
        const data = await readFile(filePath, 'utf-8');
        const blogsData = JSON.parse(data);
        await Blog.deleteMany();
        await Blog.insertMany(blogsData);
        res.json({ message: 'Blogs preloaded!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
