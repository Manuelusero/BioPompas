import fs from "fs";
import path from 'path';
import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "./src/models/Product.js";
import Category from "./src/models/Category.js";
import Blog from "./src/models/Blog.js";
import OurStore from "./src/models/OurStore.js";

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
    await bulkCreateCategories();
    await bulkCreateBlogs();
    await bulkCreateOurStore();
  } catch (error) {
    console.error("❌ Error al cargar datos:", error);
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
    const json = JSON.parse(rawData);
    const products = json.products;

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

// Carga masiva de Categories
export const bulkCreateCategories = async () => {
  // Ruta del archivo JSON de Categories
  const dataPath = path.join(process.cwd(), 'src', 'data', 'categories.json');

  try {
    console.log("Cargando Categories desde JSON...");

    if (!fs.existsSync(dataPath)) {
      console.error('El archivo JSON de Categories no existe');
      return;
    }

    // Leer archivo JSON
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const categories = JSON.parse(rawData);

    if (!Array.isArray(categories) || categories.length === 0) {
      console.error('El archivo JSON debe contener un array de Categories');
      return;
    }

    // Eliminar Categories existentes antes de insertar nuevas
    await Category.deleteMany({});
    console.log("Categories eliminadas de la base de datos");

    // Insertar Categories en MongoDB
    await Category.insertMany(categories);
    console.log("Categories cargadas exitosamente");

    return { message: 'Categories agregadas correctamente' };
  } catch (error) {
    console.error('Error al cargar Categories:', error);
    return { error: 'Error al cargar Categories' };
  }
};



// Carga masiva de Blogs
export const bulkCreateBlogs = async () => {
  const dataPath = path.join(process.cwd(), 'src', 'data', 'blogs.json');
  try {
    console.log("Cargando Blogs desde JSON...");
    if (!fs.existsSync(dataPath)) {
      console.error('El archivo JSON de Blogs no existe');
      return;
    }
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const blogs = JSON.parse(rawData);
    if (!Array.isArray(blogs) || blogs.length === 0) {
      console.error('El archivo JSON debe contener un array de Blogs');
      return;
    }
    await Blog.deleteMany({});
    console.log("Blogs eliminados de la base de datos");
    await Blog.insertMany(blogs);
    console.log("Blogs cargados exitosamente");
    return { message: 'Blogs agregados correctamente' };
  } catch (error) {
    console.error('Error al cargar Blogs:', error);
    return { error: 'Error al cargar Blogs' };
  }
};

// Carga masiva de Our Store
export const bulkCreateOurStore = async () => {
  const dataPath = path.join(process.cwd(), 'src', 'data', 'ourStore.json');
  try {
    console.log("Cargando Our Store desde JSON...");
    if (!fs.existsSync(dataPath)) {
      console.error('El archivo JSON de Our Store no existe');
      return;
    }
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const ourStore = JSON.parse(rawData);
    if (!Array.isArray(ourStore) || ourStore.length === 0) {
      console.error('El archivo JSON debe contener un array de Our Store');
      return;
    }
    await OurStore.deleteMany({});
    console.log("Our Store eliminado de la base de datos");
    await OurStore.insertMany(ourStore);
    console.log("Our Store cargado exitosamente");
    return { message: 'Our Store agregado correctamente' };
  } catch (error) {
    console.error('Error al cargar Our Store:', error);
    return { error: 'Error al cargar Our Store' };
  }
};

dotenv.config();
sync();
