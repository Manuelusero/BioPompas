import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../api/CartContext";
import './Bag.css';

const DELIVERY_COST = 8;

const Bag = () => {
  const navigate = useNavigate();
  const { cartItems, loading, updateCartItem, removeFromCart } = useCart();
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    // Pequeño delay para asegurar que el cart context esté cargado
    const timer = setTimeout(() => {
      setLocalLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleCountChange = async (itemId, delta) => {
    const currentItem = cartItems.find(item => item._id === itemId);
    if (!currentItem) return;

    const currentQuantity = currentItem.quantity || currentItem.count || 1;
    const newQuantity = currentQuantity + delta;
    
    if (newQuantity <= 0) {
      await handleRemove(itemId);
      return;
    }

    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error) {
      console.error('Error updating item:', error);
      // Fallback: actualizar localStorage directamente
      const storedCart = localStorage.getItem('cart');
      let cartArr = storedCart ? JSON.parse(storedCart) : [];
      const idx = cartArr.findIndex(item => item._id === itemId);
      if (idx !== -1) {
        cartArr[idx].count = Math.max(1, newQuantity);
        cartArr[idx].quantity = cartArr[idx].count;
        localStorage.setItem('cart', JSON.stringify(cartArr));
        window.dispatchEvent(new Event('cartUpdated'));
      }
    }
  };

  const orderTotal = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || item.count || 1)), 0);
  const summaryTotal = orderTotal + DELIVERY_COST;

  const isLoading = loading || localLoading;

  return (
    <div className="bag-page">
      <div className="bag-header-row">
        <button className="bag-close-btn" onClick={() => navigate('/home')}>&times;</button>
        <h1 className="bag-title">MY BAG</h1>
      </div>
      <div className="bag-list">
        {isLoading ? (
          <div className="bag-empty">Loading...</div>
        ) : cartItems.length === 0 ? (
          <div className="bag-empty">Your bag is empty.</div>
        ) : (
          cartItems.map((item) => (
                        <div className="bag-item" key={item._id}>
              <img
                src={item.image?.startsWith('http') ? item.image : `http://localhost:5001${item.image || item.url}`}
                alt={item.name}
                className="bag-item-img"
                onError={e => { e.target.onerror = null; e.target.src = '/src/assets/Icons/ImagePlaceholder.png'; }}
              />
              <div className="bag-item-info">
                <div className="bag-item-header">
                  <div className="bag-item-title">{item.name}</div>
                  <button 
                    className="bag-item-remove" 
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemove(item._id);
                    }}
                    disabled={loading}
                  >
                    <img src="/src/assets/Icons/Basura.png" alt="Delete" />
                  </button>
                </div>
                <div className="bag-item-footer">
                  <div className="bag-item-price">€ {item.price.toFixed(2)}</div>
                  <div className="bag-item-counter">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        handleCountChange(item._id, -1);
                      }}
                      disabled={loading}
                    >
                      -
                    </button>
                    <span>{item.quantity || item.count || 1}</span>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        handleCountChange(item._id, 1);
                      }}
                      disabled={loading}
                    >
                      +
                    </button>
                  </div>
                </div>
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
