import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Obtener token del usuario
  const getToken = () => localStorage.getItem('token');

  // Verificar si el usuario está logueado
  const isLoggedIn = () => !!getToken();

  // Obtener carrito de localStorage
  const getLocalCart = () => {
    const localCart = JSON.parse(localStorage.getItem('cart')) || [];
    return localCart.filter(item => item._id && (item.count > 0 || item.quantity > 0));
  };

  // Guardar carrito en localStorage
  const saveLocalCart = (items) => {
    localStorage.setItem('cart', JSON.stringify(items));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Calcular contador del carrito
  const calculateCartCount = (items) => {
    return items.reduce((acc, item) => acc + (item.quantity || item.count || 1), 0);
  };

  // Sincronizar carrito cuando el usuario se loguea
  const syncCartWithBackend = async () => {
    if (!isLoggedIn()) return;

    const localCart = getLocalCart();
    if (localCart.length === 0) return;

    try {
      setLoading(true);
      
      // Mapear formato de localStorage a formato del backend
      const localCartItems = localCart.map(item => ({
        productId: item._id,
        quantity: item.quantity || item.count || 1,
        price: item.price,
        name: item.name,
        image: item.image || item.url
      }));

      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/cart/sync`,
        { localCartItems },
        {
          headers: { Authorization: `Bearer ${getToken()}` }
        }
      );

      // Actualizar carrito con respuesta del backend
      const backendCart = response.data.items.map(item => ({
        _id: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
        count: item.quantity
      }));

      setCartItems(backendCart);
      setCartCount(calculateCartCount(backendCart));
      
      // Limpiar localStorage después de sincronizar
      localStorage.removeItem('cart');

      console.log('✅ Carrito sincronizado con backend');
    } catch (error) {
      console.error('❌ Error sincronizando carrito:', error);
      // Si falla la sincronización, mantener el carrito local
      setCartItems(localCart);
      setCartCount(calculateCartCount(localCart));
    } finally {
      setLoading(false);
    }
  };

  // Obtener carrito del backend
  const fetchBackendCart = async () => {
    if (!isLoggedIn()) return null;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/cart`,
        {
          headers: { Authorization: `Bearer ${getToken()}` }
        }
      );

      const backendCart = response.data.items.map(item => ({
        _id: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
        count: item.quantity
      }));

      return backendCart;
    } catch (error) {
      console.error('❌ Error obteniendo carrito del backend:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      return null;
    }
  };

  // Cargar carrito (backend si está logueado, localStorage si no)
  const fetchCart = async () => {
    setLoading(true);

    if (isLoggedIn()) {
      // Usuario logueado: intentar cargar del backend
      const backendCart = await fetchBackendCart();
      
      if (backendCart) {
        setCartItems(backendCart);
        setCartCount(calculateCartCount(backendCart));
      } else {
        // Si falla el backend, usar localStorage
        const localCart = getLocalCart();
        setCartItems(localCart);
        setCartCount(calculateCartCount(localCart));
      }
    } else {
      // Usuario no logueado: usar localStorage
      const localCart = getLocalCart();
      setCartItems(localCart);
      setCartCount(calculateCartCount(localCart));
    }

    setLoading(false);
  };

  // Agregar producto al carrito
  const addToCart = async (product, quantity = 1) => {
    if (isLoggedIn()) {
      // Usuario logueado: agregar al backend
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_APP_API_URL}/cart`,
          {
            productId: product._id,
            quantity,
            price: product.price,
            name: product.name,
            image: product.image || product.url
          },
          {
            headers: { Authorization: `Bearer ${getToken()}` }
          }
        );

        await fetchCart(); // Recargar carrito
        return response.data;
      } catch (error) {
        console.error('❌ Error agregando al carrito:', error);
        throw error;
      }
    } else {
      // Usuario no logueado: agregar a localStorage
      const localCart = getLocalCart();
      const existingIndex = localCart.findIndex(item => item._id === product._id);

      if (existingIndex > -1) {
        localCart[existingIndex].quantity = (localCart[existingIndex].quantity || localCart[existingIndex].count || 1) + quantity;
        localCart[existingIndex].count = localCart[existingIndex].quantity;
      } else {
        localCart.push({
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image || product.url,
          quantity,
          count: quantity
        });
      }

      saveLocalCart(localCart);
      setCartItems(localCart);
      setCartCount(calculateCartCount(localCart));
    }
  };

  // Actualizar cantidad de producto
  const updateCartItem = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      return removeFromCart(productId);
    }

    if (isLoggedIn()) {
      // Usuario logueado: actualizar en backend
      try {
        await axios.put(
          `${import.meta.env.VITE_APP_API_URL}/cart/${productId}`,
          { productId, quantity: newQuantity },
          {
            headers: { Authorization: `Bearer ${getToken()}` }
          }
        );

        await fetchCart(); // Recargar carrito
      } catch (error) {
        console.error('❌ Error actualizando carrito:', error);
        throw error;
      }
    } else {
      // Usuario no logueado: actualizar localStorage
      const localCart = getLocalCart();
      const index = localCart.findIndex(item => item._id === productId);

      if (index > -1) {
        localCart[index].quantity = newQuantity;
        localCart[index].count = newQuantity;
        saveLocalCart(localCart);
        setCartItems(localCart);
        setCartCount(calculateCartCount(localCart));
      }
    }
  };

  // Eliminar producto del carrito
  const removeFromCart = async (productId) => {
    if (isLoggedIn()) {
      // Usuario logueado: eliminar del backend
      try {
        await axios.delete(
          `${import.meta.env.VITE_APP_API_URL}/cart/${productId}`,
          {
            headers: { Authorization: `Bearer ${getToken()}` }
          }
        );

        await fetchCart(); // Recargar carrito
      } catch (error) {
        console.error('❌ Error eliminando del carrito:', error);
        throw error;
      }
    } else {
      // Usuario no logueado: eliminar de localStorage
      const localCart = getLocalCart();
      const filteredCart = localCart.filter(item => item._id !== productId);
      saveLocalCart(filteredCart);
      setCartItems(filteredCart);
      setCartCount(calculateCartCount(filteredCart));
    }
  };

  // Limpiar carrito
  const clearCart = async () => {
    if (isLoggedIn()) {
      // Usuario logueado: limpiar backend
      try {
        await axios.delete(
          `${import.meta.env.VITE_APP_API_URL}/cart`,
          {
            headers: { Authorization: `Bearer ${getToken()}` }
          }
        );
      } catch (error) {
        console.error('❌ Error limpiando carrito:', error);
      }
    }

    // Limpiar localStorage y estado
    localStorage.removeItem('cart');
    setCartItems([]);
    setCartCount(0);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  useEffect(() => {
    fetchCart();

    // Escuchar cambios en localStorage y token
    const handleStorageChange = (e) => {
      if (e.key === 'cart' || e.key === 'token') {
        fetchCart();
      }
    };

    const handleCartUpdate = () => {
      fetchCart();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const value = {
    cartCount,
    cartItems,
    loading,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    syncCartWithBackend,
    isLoggedIn
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node,
};

CartProvider.propTypes = {
  children: PropTypes.node,
};
