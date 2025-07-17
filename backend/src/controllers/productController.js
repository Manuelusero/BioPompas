import Product from '../models/Product.js';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

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
    const filePath = path.join(process.cwd(), 'src/data/products.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(data);
    res.status(200).json(json.products || []);
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

// Eliminar todos los productos
export const deleteAllProducts = async () => {
  try {
    await Product.deleteMany();
    console.log('🗑️ Todos los productos han sido eliminados');
  } catch (error) {
    console.error('Error al eliminar todos los productos:', error);
  }
};
