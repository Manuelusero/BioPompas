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

// Add JSON error handling
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    console.error('Stack trace:', error.stack);
    if (error.message.includes('JSON.parse')) {
        console.error('JSON Parse Error - Check your JSON files for syntax errors');
    }
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

try {
    connectDB();
} catch (error) {
    console.error('Error connecting to database:', error);
}

const app = express();

// Add middleware to handle JSON parsing errors
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('Bad JSON:', err);
        return res.status(400).json({ error: 'Invalid JSON' });
    }
    next();
});

app.use(express.json());

// CORS config (después de imports y antes de rutas)
const allowedOrigins = [
    'https://natural-staff.vercel.app',
    'http://localhost:5173',
    'http://127.0.0.1:5173'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true,
}));

// CORS para imágenes
app.use('/uploads', cors({ origin: allowedOrigins }), express.static(path.join(process.cwd(), 'src/uploads')));

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

// Wrap route imports and usage in try-catch to identify problematic routes
try {
    app.use("/api/auth", authRoutes);
    console.log("✅ Auth routes loaded successfully");
} catch (error) {
    console.error("❌ Error loading auth routes:", error);
}

try {
    app.use('/api/products', productRoutes);
    console.log("✅ Product routes loaded successfully");
} catch (error) {
    console.error("❌ Error loading product routes:", error);
}

try {
    app.use('/api/cart', cartRoutes);
    console.log("✅ Cart routes loaded successfully");
} catch (error) {
    console.error("❌ Error loading cart routes:", error);
}

try {
    app.use('/api/checkout', checkoutRoutes);
    console.log("✅ Checkout routes loaded successfully");
} catch (error) {
    console.error("❌ Error loading checkout routes:", error);
}

try {
    app.use('/api/categories', categoryRoutes);
    console.log("✅ Category routes loaded successfully");
} catch (error) {
    console.error("❌ Error loading category routes:", error);
}

try {
    app.use('/api/promotions', promotionsRoutes);
    console.log("✅ Promotion routes loaded successfully");
} catch (error) {
    console.error("❌ Error loading promotion routes:", error);
}

try {
    app.use('/api/blogs', blogRoutes);
    console.log("✅ Blog routes loaded successfully");
} catch (error) {
    console.error("❌ Error loading blog routes:", error);
}

try {
    app.use('/api/our-store', ourStoreRoutes);
    console.log("✅ Our store routes loaded successfully");
} catch (error) {
    console.error("❌ Error loading our store routes:", error);
}

app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log(`Health check disponible en: http://localhost:${PORT}/api/health`);
    console.log(`Version: 1.0.2 - Auth improvements and SearchSeccion icon - Dec 17 2024`);
});
// Force redeploy after Vercel infrastructure recovery - SearchSeccion icon and auth fixes
