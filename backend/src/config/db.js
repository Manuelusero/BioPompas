import mongoose from "mongoose";
import Product from "../models/Product.js";
import { bulkCreateProducts } from "../controllers/productController.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error conectando a MongoDB: ${error.message}`);
    process.exit(1);
  }

  try {
    const count = await Product.countDocuments();
    if (count === 0) { // Solo insertar si la colección está vacía
      await bulkCreateProducts({ body: {} }, { status: () => ({ json: () => {} }) });
      console.log("✅ Productos precargados desde JSON");
    } else {
      console.log("⚠️ Los productos ya existen, no se han duplicado.");
    }
  } catch (error) {
    console.error("❌ Error al cargar productos:", error);
  }
};

export default connectDB;
