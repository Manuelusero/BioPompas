import fs from 'fs';
import path from 'path';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

// Ruta del archivo JSON de productos
const dataPath = path.join(process.cwd(), 'src', 'data', 'products.json');

// Crear un nuevo producto
export const createProduct = async (req, res) => {
  const { name, description, price, category, stock } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
      url: imageUrl
    });

    await newProduct.save();
    res.status(201).json({ message: 'Producto creado correctamente', product: newProduct });
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

// Obtener todos los productos
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// Obtener un producto por su ID
export const getProductById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'ID de producto inválido' });
  }

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    res.status(200).json(product);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};

// Actualizar un producto
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'El ID del producto es inválido' });
  }

  const { name, description, price, category, stock } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

  try {
    const updateData = { name, description, price, category, stock };
    if (imageUrl) updateData.url = imageUrl;

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(200).json({ message: 'Producto actualizado correctamente', product: updatedProduct });
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'ID de producto inválido' });
  }

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) return res.status(404).json({ error: 'Producto no encontrado' });

    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};

// Carga masiva de productos desde un archivo JSON
export const bulkCreateProducts = async (req, res) => {
  try {
    console.log("Cargando productos desde JSON...");

    if (!fs.existsSync(dataPath)) {
      return res.status(400).json({ error: 'El archivo JSON no existe' });
    }

    // Leer archivo JSON
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const products = JSON.parse(rawData);

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'El archivo JSON debe contener un array de productos' });
    }

    // Eliminar productos existentes antes de insertar nuevos
    await Product.deleteMany({});
    console.log("Productos eliminados de la base de datos");

    // Formatear productos para MongoDB
    const formattedProducts = products.map(product => ({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      url: product.url || product.image || null,
      isFeatured: product.isFeatured || false
    }));

    // Insertar productos en MongoDB
    await Product.insertMany(formattedProducts);
    console.log("Productos cargados exitosamente");

    res.status(201).json({ message: 'Productos agregados correctamente' });
  } catch (error) {
    console.error('Error al cargar productos:', error);
    res.status(500).json({ error: 'Error al cargar productos' });
  }
};

// Eliminar todos los productos
export const deleteAllProducts = async (req, res) => {
  try {
    await Product.deleteMany({});
    res.status(200).json({ message: 'Todos los productos han sido eliminados' });
  } catch (error) {
    console.error('Error al eliminar todos los productos:', error);
    res.status(500).json({ error: 'Error al eliminar los productos' });
  }
};
