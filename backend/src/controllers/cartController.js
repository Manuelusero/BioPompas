import Cart from '../models/Cart.js';

// Obtener carrito del usuario
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart) {
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.status(500).json({ error: 'Error al obtener carrito' });
  }
};

// Agregar producto al carrito
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1, price, name, image } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Verificar si el producto ya existe en el carrito
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Si existe, actualizar cantidad
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Si no existe, agregar nuevo item
      cart.items.push({
        productId,
        quantity,
        price,
        name,
        image
      });
    }

    await cart.save();
    await cart.populate('items.productId');

    res.json(cart);
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    res.status(500).json({ error: 'Error al agregar al carrito' });
  }
};

// Actualizar cantidad de producto en carrito
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Producto no encontrado en carrito' });
    }

    if (quantity <= 0) {
      // Si la cantidad es 0 o menor, eliminar el producto
      cart.items.splice(itemIndex, 1);
    } else {
      // Actualizar cantidad
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.productId');

    res.json(cart);
  } catch (error) {
    console.error('Error al actualizar carrito:', error);
    res.status(500).json({ error: 'Error al actualizar carrito' });
  }
};

// Eliminar producto del carrito
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );

    await cart.save();
    await cart.populate('items.productId');

    res.json(cart);
  } catch (error) {
    console.error('Error al eliminar del carrito:', error);
    res.status(500).json({ error: 'Error al eliminar del carrito' });
  }
};

// Limpiar carrito
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    } else {
      cart.items = [];
    }

    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error('Error al limpiar carrito:', error);
    res.status(500).json({ error: 'Error al limpiar carrito' });
  }
};

// Sincronizar carrito de localStorage con el backend
export const syncCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { localCartItems } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Merge localStorage items with backend cart
    for (const localItem of localCartItems) {
      const existingItemIndex = cart.items.findIndex(
        item => item.productId.toString() === localItem.productId
      );

      if (existingItemIndex > -1) {
        // Si existe, sumar las cantidades
        cart.items[existingItemIndex].quantity += localItem.quantity;
      } else {
        // Si no existe, agregar nuevo item
        cart.items.push(localItem);
      }
    }

    await cart.save();
    await cart.populate('items.productId');

    res.json(cart);
  } catch (error) {
    console.error('Error al sincronizar carrito:', error);
    res.status(500).json({ error: 'Error al sincronizar carrito' });
  }
};
