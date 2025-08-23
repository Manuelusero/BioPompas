import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  // Helper to fetch cart from backend or localStorage
  const fetchCart = async () => {
    // Por ahora, solo usar localStorage para evitar errores 500 al cargar la página
    const guestCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(guestCart);
    setCartCount(guestCart.reduce((acc, item) => acc + (item.quantity || item.count || 1), 0));
    
    // TODO: Reactivar backend cuando esté funcionando correctamente
    /*
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await axios.get('/api/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(res.data.cartItems || []);
        setCartCount(res.data.cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0);
      } catch (err) {
        console.log('Backend cart failed, using localStorage fallback');
        // Si el backend falla, usar localStorage como fallback
        const guestCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(guestCart);
        setCartCount(guestCart.reduce((acc, item) => acc + (item.quantity || item.count || 1), 0));
        
        if (err.response && err.response.status === 401) {
          // Token inválido o expirado, limpiar
          localStorage.removeItem('token');
        }
      }
    } else {
      // Guest cart
      const guestCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartItems(guestCart);
      setCartCount(guestCart.reduce((acc, item) => acc + (item.quantity || item.count || 1), 0));
    }
    */
  };

  useEffect(() => {
    fetchCart();
    // Listen to storage changes (for multi-tab sync)
    const onStorage = (e) => {
      if (e.key === 'cart' || e.key === 'token') fetchCart();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Call this after any cart update
  const refreshCart = fetchCart;

  return (
    <CartContext.Provider value={{ cartCount, cartItems, refreshCart, fetchCart }}>
      {children || null}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node,
};
