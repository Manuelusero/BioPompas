import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Bag.css';

const DELIVERY_COST = 8;

const Bag = () => {
  const navigate = useNavigate();
  // ...existing code...
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/cart`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCart(response.data.items || []);
        } catch {
          setCart([]);
        }
      } else {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          const cleanCart = JSON.parse(storedCart).filter(item => item._id && item.count > 0);
          setCart(cleanCart);
          if (cleanCart.length !== JSON.parse(storedCart).length) {
            localStorage.setItem('cart', JSON.stringify(cleanCart));
          }
        } else {
          setCart([]);
        }
      }
      setLoading(false);
    };
    fetchCart();
    const updateCart = () => fetchCart();
    window.addEventListener('cartUpdated', updateCart);
    window.addEventListener('storage', updateCart);
    return () => {
      window.removeEventListener('cartUpdated', updateCart);
      window.removeEventListener('storage', updateCart);
    };
  }, []);

  const handleRemove = async (itemId) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axios.delete(`${import.meta.env.VITE_APP_API_URL}/cart/${itemId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        window.dispatchEvent(new Event('cartUpdated'));
      } catch {
        alert('Error removing product from cart');
      }
    } else {
      const storedCart = localStorage.getItem('cart');
      let cartArr = storedCart ? JSON.parse(storedCart) : [];
      cartArr = cartArr.filter(item => item._id !== itemId && item._id && item.count > 0);
      localStorage.setItem('cart', JSON.stringify(cartArr));
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const handleCountChange = async (itemId, delta) => {
    const token = localStorage.getItem('token');
    if (token) {
      const item = cart.find(i => i._id === itemId);
      if (!item) return;
      const newQuantity = Math.max(1, (item.quantity || item.count || 1) + delta);
      if (newQuantity <= 0) {
        await handleRemove(itemId);
        return;
      }
      try {
        await axios.put(
          `${import.meta.env.VITE_APP_API_URL}/cart/${itemId}`,
          { quantity: newQuantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        window.dispatchEvent(new Event('cartUpdated'));
      } catch {
        alert('Error updating cart');
      }
    } else {
      const storedCart = localStorage.getItem('cart');
      let cartArr = storedCart ? JSON.parse(storedCart) : [];
      const idx = cartArr.findIndex(item => item._id === itemId);
      if (idx !== -1) {
        cartArr[idx].count = Math.max(1, (cartArr[idx].count || 1) + delta);
        if (cartArr[idx].count <= 0) {
          cartArr.splice(idx, 1);
        }
        cartArr = cartArr.filter(item => item._id && item.count > 0);
        localStorage.setItem('cart', JSON.stringify(cartArr));
        window.dispatchEvent(new Event('cartUpdated'));
      }
    }
  };

  const orderTotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || item.count || 1)), 0);
  const summaryTotal = orderTotal + DELIVERY_COST;

  return (
    <div className="bag-page">
      <div className="bag-header-row">
        <button className="bag-close-btn" onClick={() => navigate('/home')}>&times;</button>
        <h1 className="bag-title">MY BAG</h1>
      </div>
      <div className="bag-list">
        {loading ? (
          <div className="bag-empty">Loading...</div>
        ) : cart.length === 0 ? (
          <div className="bag-empty">Your bag is empty.</div>
        ) : (
          cart.map((item) => (
            <div className="bag-item" key={item._id}>
              <img
                src={item.image?.startsWith('http') ? item.image : `http://localhost:5001${item.image || item.url}`}
                alt={item.name}
                className="bag-item-img"
                onError={e => { e.target.onerror = null; e.target.src = '/src/assets/Icons/ImagePlaceholder.png'; }}
              />
              <div className="bag-item-info">
                <div className="bag-item-title">{item.name}</div>
                <div className="bag-item-price">€ {item.price.toFixed(2)}</div>
              </div>
              <div className="bag-item-actions">
                <div className="bag-item-counter">
                  <button onClick={() => handleCountChange(item._id, -1)}>-</button>
                  <span>{item.quantity || item.count || 1}</span>
                  <button onClick={() => handleCountChange(item._id, 1)}>+</button>
                </div>
                <button className="bag-item-remove" onClick={() => handleRemove(item._id)}>
                  <img src="/src/assets/Icons/DeleteIcon.png" alt="Delete" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="bag-total-section">
        <div className="bag-total-title">TOTAL</div>
        <div className="bag-total-box">
          <div className="bag-total-row">
            <span>Order</span>
            <span>€ {orderTotal.toFixed(2)}</span>
          </div>
          <div className="bag-total-row">
            <span>Delivery</span>
            <span>€ {DELIVERY_COST.toFixed(2)}</span>
          </div>
          <div className="bag-total-row bag-total-summary">
            <span>Summary</span>
            <span>€ {summaryTotal.toFixed(2)}</span>
          </div>
        </div>
        <button className="bag-checkout-btn" onClick={() => navigate('/payment')}>Checkout</button>
      </div>
    </div>
  );
};

export default Bag;
