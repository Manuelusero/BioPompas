import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Obtener o generar cartId para Safari
  const getCartId = () => {
    let cartId = localStorage.getItem('cartId');
    if (!cartId) {
      cartId = 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('cartId', cartId);
    }
    return cartId;
  };

  // Obtener token del usuario
  const getToken = () => localStorage.getItem('token');

  // Verificar si el usuario está logueado
  const isLoggedIn = () => !!getToken();

  // Obtener carrito de localStorage
  const getLocalCart = () => {
    const localCart = JSON.parse(localStorage.getItem('cart')) || [];
    const filteredCart = localCart.filter(item => item._id && (item.count > 0 || item.quantity > 0));
    return filteredCart;
  };

  // Guardar carrito en localStorage
  const saveLocalCart = (items) => {
    localStorage.setItem('cart', JSON.stringify(items));
    // Comentamos temporalmente para evitar loops de actualización
    // window.dispatchEvent(new Event('cartUpdated'));
  };

  // Calcular contador del carrito
  const calculateCartCount = (items) => {
    return items.reduce((acc, item) => acc + (item.quantity || item.count || 1), 0);
  };

  // Sincronizar carrito cuando el usuario se loguea
  const syncCartWithBackend = async () => {
    if (!isLoggedIn()) return;

    const localCart = getLocalCart();
    
    if (localCart.length === 0) {
      return;
    }

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
          headers: { 
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
            'X-Cart-Id': getCartId()
          },
          withCredentials: true
        }
      );

      // Verificar que la respuesta sea JSON válido
      if (!response.data || !response.data.items) {
        throw new Error('Invalid response format from backend');
      }

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

    } catch (error) {
      console.error('❌ Error sincronizando carrito:', error);
      // Si falla la sincronización, mantener el carrito local actual
      setCartItems(localCart);
      setCartCount(calculateCartCount(localCart));
    } finally {
      setLoading(false);
    }
  };

  // Cargar carrito desde backend forzadamente (para usar después del login)
  const forceLoadFromBackend = async () => {
    const token = getToken();
    if (!token) return;

    try {
      setLoading(true);
      
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/cart`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'X-Cart-Id': getCartId() // Header para Safari
          },
          withCredentials: true // Importante para Safari
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
      
      setCartItems(backendCart);
      setCartCount(calculateCartCount(backendCart));
      
      // Actualizar localStorage con el carrito del backend
      saveLocalCart(backendCart);
      
    } catch (error) {
      console.error('❌ Error cargando carrito del backend:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar carrito (localStorage siempre tiene prioridad absoluta)
  const fetchCart = useCallback(async () => {
    setLoading(true);

    // Verificar si hay datos en localStorage (aunque esté vacío)
    const cartData = localStorage.getItem('cart');
    
    if (cartData !== null) {
      // Si existe la key 'cart' en localStorage, usar eso como fuente de verdad
      const localCart = JSON.parse(cartData) || [];
      const filteredCart = localCart.filter(item => item._id && (item.count > 0 || item.quantity > 0));
      
      setCartItems(filteredCart);
      setCartCount(calculateCartCount(filteredCart));
      setLoading(false);
      return;
    }

    // Solo cargar del backend si NO existe la key 'cart' en localStorage (primera carga)
    const token = getToken();
    if (token) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/cart`,
          {
            headers: { Authorization: `Bearer ${token}` }
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

        setCartItems(backendCart);
        setCartCount(calculateCartCount(backendCart));
        // Guardar en localStorage para futuras cargas
        saveLocalCart(backendCart);
      } catch (error) {
        console.error('❌ Error obteniendo carrito del backend:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
        }
        // Si falla, crear localStorage vacío
        saveLocalCart([]);
        setCartItems([]);
        setCartCount(0);
      }
    } else {
      // Usuario no logueado: crear localStorage vacío
      saveLocalCart([]);
      setCartItems([]);
      setCartCount(0);
    }

    setLoading(false);
  }, []);

  // Agregar producto al carrito
  const addToCart = async (product, quantity = 1) => {
    // Validar quantity
    const safeQuantity = typeof quantity === 'number' && quantity > 0 ? quantity : 1;
    if (isLoggedIn()) {
      // Usuario logueado: agregar al backend
      try {
        console.log("🛒 Enviando al backend:", {
          productId: product._id,
          quantity: safeQuantity,
          price: product.price,
          name: product.name,
          image: product.image || product.url
        });

        const requestBody = {
          productId: product._id,
          quantity: safeQuantity,
          price: product.price,
          name: product.name,
          image: product.image || product.url
        };

        // Para Safari, siempre incluir cartId como fallback
        requestBody.cartId = getCartId();

        const response = await axios.post(
          `${import.meta.env.VITE_APP_API_URL}/cart`,
          requestBody,
          {
            headers: { 
              Authorization: `Bearer ${getToken()}`,
              'Content-Type': 'application/json',
              'X-Cart-Id': getCartId() // Header adicional para Safari
            },
            withCredentials: true // Importante para Safari
          }
        );

        // Si el backend devuelve un cartId, guardarlo
        if (response.data.cartId) {
          localStorage.setItem('cartId', response.data.cartId);
        }

        // Actualizar estado local inmediatamente
        setCartItems(prevItems => {
          const existingIndex = prevItems.findIndex(item => item._id === product._id);
          let updatedItems;
          
          if (existingIndex > -1) {
            updatedItems = prevItems.map((item, index) => 
              index === existingIndex 
                ? { ...item, quantity: item.quantity + safeQuantity, count: item.quantity + safeQuantity }
                : item
            );
          } else {
            updatedItems = [...prevItems, {
              _id: product._id,
              name: product.name,
              price: product.price,
              image: product.image || product.url,
              quantity: safeQuantity,
              count: safeQuantity
            }];
          }
          
          setCartCount(calculateCartCount(updatedItems));
          
          // También actualizar localStorage para mantener sincronización
          saveLocalCart(updatedItems);
          
          return updatedItems;
        });

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

    // Actualizar inmediatamente en el estado local para UI responsiva
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item => 
        item._id === productId 
          ? { ...item, quantity: newQuantity, count: newQuantity }
          : item
      );
      
      // Actualizar el contador después de actualizar los items
      setCartCount(calculateCartCount(updatedItems));
      
      // Siempre actualizar localStorage para mantener sincronización
      saveLocalCart(updatedItems);
      
      return updatedItems;
    });

    // NO intentar actualizar el backend aquí para evitar errores
    // El backend se actualizará cuando se haga checkout o se agreguen nuevos productos
  };

  // Eliminar producto del carrito
  const removeFromCart = async (productId) => {
    // Actualizar inmediatamente el estado local para UI responsiva
    setCartItems(prevItems => {
      const filteredItems = prevItems.filter(item => item._id !== productId);
      setCartCount(calculateCartCount(filteredItems));
      
      // Siempre actualizar localStorage para mantener sincronización
      saveLocalCart(filteredItems);
      
      return filteredItems;
    });

    // NO intentar eliminar del backend aquí para evitar errores
    // El backend se actualizará cuando se haga checkout o se agreguen nuevos productos
  };

  // Limpiar carrito
  const clearCart = async () => {
    if (isLoggedIn()) {
      // Usuario logueado: limpiar backend
      try {
        await axios.delete(
          `${import.meta.env.VITE_APP_API_URL}/cart`,
          {
            headers: { 
              Authorization: `Bearer ${getToken()}`,
              'X-Cart-Id': getCartId()
            },
            withCredentials: true
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
      if (e.key === 'token') {
        fetchCart();
      }
      // Comentamos temporalmente la escucha de 'cart' para evitar loops
      // if (e.key === 'cart') {
      //   fetchCart();
      // }
    };

    // Comentamos temporalmente para evitar recargas innecesarias
    // const handleCartUpdate = () => {
    //   fetchCart();
    // };

    window.addEventListener('storage', handleStorageChange);
    // window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      // window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [fetchCart]);

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
    forceLoadFromBackend,
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
