import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Bag.css';

const DELIVERY_COST = 8;

const Bag = () => {
  const navigate = useNavigate();
  // ...existing code...
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const axios = (await import('axios')).default;
        const res = await axios.get(`${import.meta.env.VITE_APP_API_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCart(res.data.items || []);
      } catch {
        setCart([]);
      }
    };
    fetchCart();
    const updateCart = () => fetchCart();
    window.addEventListener('cartUpdated', updateCart);
    return () => window.removeEventListener('cartUpdated', updateCart);
  }, []);

  const handleRemove = (productId) => {
    const token = localStorage.getItem('token');
    import('axios').then(({default: axios}) => {
      axios.delete(`${import.meta.env.VITE_APP_API_URL}/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(() => {
        window.dispatchEvent(new Event('cartUpdated'));
      });
    });
  };

  const handleCountChange = (productId, delta) => {
    const token = localStorage.getItem('token');
    import('axios').then(({default: axios}) => {
      axios.put(`${import.meta.env.VITE_APP_API_URL}/cart/${productId}`, { quantity: delta }, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(() => {
        window.dispatchEvent(new Event('cartUpdated'));
      });
    });
  };

  const orderTotal = cart.reduce((sum, item) => sum + (item.price * (item.count || 1)), 0);
  const summaryTotal = orderTotal + DELIVERY_COST;

  return (
    <div className="bag-page">
      <div className="bag-header-row">
        <button className="bag-close-btn" onClick={() => navigate('/home')}>&times;</button>
        <h1 className="bag-title">MY BAG</h1>
      </div>
      <div className="bag-list">
        {cart.length === 0 ? (
          <div className="bag-empty">Your bag is empty.</div>
        ) : (
          cart.map((item, idx) => (
            <div className="bag-item" key={`${item.id || item._id}-${idx}`}>
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
                  <button onClick={() => handleCountChange(item.id || item._id, -1)}>-</button>
                  <span>{item.count || 1}</span>
                  <button onClick={() => handleCountChange(item.id || item._id, 1)}>+</button>
                </div>
                <button className="bag-item-remove" onClick={() => handleRemove(item.id || item._id)}>
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
        {/* Eliminado redirectToLogin, ya no es necesario */}
      </div>
    </div>
  );
};

export default Bag;
