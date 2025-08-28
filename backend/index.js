import express from "express";
import promotionsRoutes from "./src/routes/promotionsRoutes.js";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import checkoutRoutes from "./src/routes/checkoutRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import blogRoutes from "./src/routes/blogRoutes.js";
import ourStoreRoutes from "./src/routes/ourStoreRoutes.js";
import cors from "cors";
import { errorHandler } from "./src/middleware/errorMiddleware.js";
import path from 'path';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://natural-staff.vercel.app',
        'https://natural-staff-git-main-manuel-useros-projects.vercel.app', 'https://natural-staff-bem3bawc5-manuel-useros-projects.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.get("/", (req, res) => {
    res.send("API funcionando 🚀");
});

app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        message: "API funcionando correctamente",
        timestamp: new Date().toISOString()
    });
});

app.use("/api/auth", authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/promotions', promotionsRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/our-store', ourStoreRoutes);
app.use('/uploads', express.static(path.join(process.cwd(), 'src/uploads')));
