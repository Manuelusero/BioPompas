import Cart from '../models/Cart.js';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';

// Obtener carrito del usuario o anónimo
export const getCart = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const cartId = req.cookies.cartId || req.headers['x-cart-id'] || null;
    let cart = null;
    if (userId) {
      cart = await Cart.findOne({ userId }).populate('items.productId');
    } else if (cartId) {
      cart = await Cart.findOne({ cartId }).populate('items.productId');
    }
    res.json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo carrito', error });
  }
};

// Agregar producto al carrito (usuario o anónimo)
export const addToCart = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    let cartId = req.cookies.cartId || req.headers['x-cart-id'] || null;
    let { productId, quantity, price, name, image } = req.body;
    console.error('[addToCart] userId:', userId, 'cartId:', cartId, 'body:', req.body);

    // Validaciones robustas
    if (!productId || typeof quantity !== 'number' || quantity <= 0) {
      console.error('[addToCart] Datos inválidos:', { productId, quantity });
      return res.status(400).json({ message: 'Datos inválidos para agregar al carrito' });
    }

    // Convertir productId a ObjectId si es string
    if (typeof productId === 'string') {
      try {
        productId = new mongoose.Types.ObjectId(productId);
      } catch (e) {
        return res.status(400).json({ message: 'productId inválido' });
      }
    }

    let cart;
    if (userId) {
      cart = await Cart.findOne({ userId });
      if (!cart) cart = new Cart({ userId, items: [] });
    } else {
      if (!cartId) {
        cartId = uuidv4();
        res.cookie('cartId', cartId, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 30 });
      }
      cart = await Cart.findOne({ cartId });
      if (!cart) cart = new Cart({ cartId: cartId, items: [] });
    }

    if (!cart.items) cart.items = [];

    // Buscar si el producto ya está en el carrito
    const itemIndex = cart.items.findIndex(item => String(item.productId) === String(productId));
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, price, name, image });
    }
    console.error('[addToCart] Antes de guardar:', JSON.stringify(cart, null, 2));
    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error('[addToCart] Error:', error);
    res.status(500).json({ message: 'Error agregando al carrito', error });
  }
};

// Actualizar cantidad de producto en carrito
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const cartId = req.cookies.cartId || req.headers['x-cart-id'] || null;
    const { itemId } = req.params;
    const { quantity } = req.body;
    let cart = userId
      ? await Cart.findOne({ userId })
      : await Cart.findOne({ cartId });
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });
    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    item.quantity = quantity;
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando cantidad', error });
  }
};

// Eliminar producto del carrito
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const cartId = req.cookies.cartId || req.headers['x-cart-id'] || null;
    const { productId } = req.params;
    let cart = userId
      ? await Cart.findOne({ userId })
      : await Cart.findOne({ cartId });
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });
    cart.items = cart.items.filter(item => String(item.productId) !== String(productId));
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando producto', error });
  }
};

// Limpiar carrito
export const clearCart = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const cartId = req.cookies.cartId || req.headers['x-cart-id'] || null;
    let cart = userId
      ? await Cart.findOne({ userId })
      : await Cart.findOne({ cartId });
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });
    cart.items = [];
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error vaciando carrito', error });
  }
};

// Sincronizar carrito de localStorage con el backend y migrar carrito anónimo al usuario
export const syncCart = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const cartId = req.cookies.cartId || req.headers['x-cart-id'] || null;
    const { localCartItems } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    // Buscar carrito anónimo y de usuario
    const anonCart = cartId ? await Cart.findOne({ cartId }) : null;
    let userCart = await Cart.findOne({ userId });
    if (!userCart) userCart = new Cart({ userId, items: [] });

    // Unir items del carrito anónimo y localStorage
    let itemsToMerge = [...(anonCart ? anonCart.items : []), ...(localCartItems || [])];
    for (const localItem of itemsToMerge) {
      const existingIndex = userCart.items.findIndex(
        item => String(item.productId) === String(localItem.productId)
      );
      if (existingIndex > -1) {
        userCart.items[existingIndex].quantity += localItem.quantity;
      } else {
        userCart.items.push({ productId: localItem.productId, quantity: localItem.quantity });
      }
    }
    await userCart.save();
    await userCart.populate('items.productId');

    // Eliminar carrito anónimo si existe
    if (anonCart) {
      await Cart.deleteOne({ cartId });
      res.clearCookie('cartId');
    }

    res.json(userCart);
  } catch (error) {
    console.error('Error al sincronizar carrito:', error);
    res.status(500).json({ error: 'Error al sincronizar carrito' });
  }
};
