import fs from "fs";
import path from 'path';
import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "./src/models/Product.js";

const sync = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error conectando a MongoDB: ${error.message}`);
    process.exit(1);
  }

  try {
    await bulkCreateProducts();
  } catch (error) {
    console.error("❌ Error al cargar productos:", error);
  } finally {
    console.log("🔄 Sincronización de base de datos completada.");
    mongoose.connection.close();
  }
};


// Carga masiva de productos desde un archivo JSON
export const bulkCreateProducts = async () => {
  // Ruta del archivo JSON de productos
  const dataPath = path.join(process.cwd(), 'src', 'data', 'products.json');

  try {
    console.log("Cargando productos desde JSON...");

    if (!fs.existsSync(dataPath)) {
      console.error('El archivo JSON no existe');
      return;
    }

    // Leer archivo JSON
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const products = JSON.parse(rawData);

    if (!Array.isArray(products) || products.length === 0) {
      console.error('El archivo JSON debe contener un array de productos');
      return;
    }

    // Eliminar productos existentes antes de insertar nuevos
    await Product.deleteMany({});
    console.log("Productos eliminados de la base de datos");

    // Insertar productos en MongoDB
    await Product.insertMany(products);
    console.log("Productos cargados exitosamente");

    return { message: 'Productos agregados correctamente' };
  } catch (error) {
    console.error('Error al cargar productos:', error);
    return { error: 'Error al cargar productos' };
  }
};

dotenv.config();
sync();
