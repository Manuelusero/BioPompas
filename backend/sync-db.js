import fs from "fs";
import path from 'path';
import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "./src/models/Product.js";
import TopPick from "./src/models/TopPick.js";
import Category from "./src/models/Category.js";
import GiftBundle from "./src/models/GiftBundle.js";
import EcoBottle from "./src/models/EcoBottle.js";
import Blog from "./src/models/Blog.js";
import EcoSouvenir from "./src/models/EcoSouvenir.js";
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
    await bulkCreateTopPicks();
    await bulkCreateCategories();
    await bulkCreateGiftBundles();
    await bulkCreateEcoBottles();
    await bulkCreateBlogs();
    await bulkCreateEcoSouvenirs();
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

// Carga masiva de Top Picks
export const bulkCreateTopPicks = async () => {
  // Ruta del archivo JSON de Top Picks
  const dataPath = path.join(process.cwd(), 'src', 'data', 'topPicks.json');

  try {
    console.log("Cargando Top Picks desde JSON...");

    if (!fs.existsSync(dataPath)) {
      console.error('El archivo JSON de Top Picks no existe');
      return;
    }

    // Leer archivo JSON
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const topPicks = JSON.parse(rawData);

    if (!Array.isArray(topPicks) || topPicks.length === 0) {
      console.error('El archivo JSON debe contener un array de Top Picks');
      return;
    }

    // Eliminar Top Picks existentes antes de insertar nuevos
    await TopPick.deleteMany({});
    console.log("Top Picks eliminados de la base de datos");

    // Insertar Top Picks en MongoDB
    await TopPick.insertMany(topPicks);
    console.log("Top Picks cargados exitosamente");

    return { message: 'Top Picks agregados correctamente' };
  } catch (error) {
    console.error('Error al cargar Top Picks:', error);
    return { error: 'Error al cargar Top Picks' };
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

// Carga masiva de Gift Bundles
export const bulkCreateGiftBundles = async () => {
  const dataPath = path.join(process.cwd(), 'src', 'data', 'giftBundles.json');
  try {
    console.log("Cargando Gift Bundles desde JSON...");
    if (!fs.existsSync(dataPath)) {
      console.error('El archivo JSON de Gift Bundles no existe');
      return;
    }
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const giftBundles = JSON.parse(rawData);
    if (!Array.isArray(giftBundles) || giftBundles.length === 0) {
      console.error('El archivo JSON debe contener un array de Gift Bundles');
      return;
    }
    await GiftBundle.deleteMany({});
    console.log("Gift Bundles eliminados de la base de datos");
    await GiftBundle.insertMany(giftBundles);
    console.log("Gift Bundles cargados exitosamente");
    return { message: 'Gift Bundles agregados correctamente' };
  } catch (error) {
    console.error('Error al cargar Gift Bundles:', error);
    return { error: 'Error al cargar Gift Bundles' };
  }
};

// Carga masiva de Eco Bottles
export const bulkCreateEcoBottles = async () => {
  const dataPath = path.join(process.cwd(), 'src', 'data', 'ecoBottles.json');
  try {
    console.log("Cargando Eco Bottles desde JSON...");
    if (!fs.existsSync(dataPath)) {
      console.error('El archivo JSON de Eco Bottles no existe');
      return;
    }
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const ecoBottles = JSON.parse(rawData);
    if (!Array.isArray(ecoBottles) || ecoBottles.length === 0) {
      console.error('El archivo JSON debe contener un array de Eco Bottles');
      return;
    }
    await EcoBottle.deleteMany({});
    console.log("Eco Bottles eliminados de la base de datos");
    await EcoBottle.insertMany(ecoBottles);
    console.log("Eco Bottles cargados exitosamente");
    return { message: 'Eco Bottles agregados correctamente' };
  } catch (error) {
    console.error('Error al cargar Eco Bottles:', error);
    return { error: 'Error al cargar Eco Bottles' };
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

// Carga masiva de Eco Souvenirs
export const bulkCreateEcoSouvenirs = async () => {
  const dataPath = path.join(process.cwd(), 'src', 'data', 'ecoSouvenirs.json');
  try {
    console.log("Cargando Eco Souvenirs desde JSON...");
    if (!fs.existsSync(dataPath)) {
      console.error('El archivo JSON de Eco Souvenirs no existe');
      return;
    }
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const ecoSouvenirs = JSON.parse(rawData);
    if (!Array.isArray(ecoSouvenirs) || ecoSouvenirs.length === 0) {
      console.error('El archivo JSON debe contener un array de Eco Souvenirs');
      return;
    }
    await EcoSouvenir.deleteMany({});
    console.log("Eco Souvenirs eliminados de la base de datos");
    await EcoSouvenir.insertMany(ecoSouvenirs);
    console.log("Eco Souvenirs cargados exitosamente");
    return { message: 'Eco Souvenirs agregados correctamente' };
  } catch (error) {
    console.error('Error al cargar Eco Souvenirs:', error);
    return { error: 'Error al cargar Eco Souvenirs' };
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
