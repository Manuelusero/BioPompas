import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import checkoutRoutes from "./src/routes/checkoutRoutes.js";
import topPickRoutes from "./src/routes/topPickRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import giftBundleRoutes from "./src/routes/giftBundleRoutes.js";
import cors from "cors";
import { errorHandler } from "./src/middleware/errorMiddleware.js";
import path from 'path';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],

}));

app.use("/api/auth", authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/top-picks', topPickRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/gift-bundles', giftBundleRoutes);
app.use('/uploads', express.static(path.join(process.cwd(), 'src/uploads')));




app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

app.get("/", (req, res) => {
    res.send("API funcionando 🚀");
});
