import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../api/CartContext";
import './Bag.css';

const DELIVERY_COST = 8;

const Bag = () => {
  const navigate = useNavigate();
  const { cartItems, loading, updateCartItem, removeFromCart, fetchCart } = useCart();
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    // Cargar carrito al montar el componente
    const loadCart = async () => {
      setLocalLoading(true);
      await fetchCart();
      setLocalLoading(false);
    };

    loadCart();
  }, [fetchCart]);

  const handleRemove = async (itemId) => {
    console.log('Removing item:', itemId);
    try {
      await removeFromCart(itemId);
      console.log('Successfully removed item');
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleCountChange = async (itemId, delta) => {
    const currentItem = cartItems.find(item => item._id === itemId);
    if (!currentItem) {
      console.log('Item not found:', itemId);
      return;
    }

    const currentQuantity = currentItem.quantity || currentItem.count || 1;
    const newQuantity = currentQuantity + delta;
    
    console.log('Changing quantity:', { itemId, currentQuantity, delta, newQuantity });
    
    if (newQuantity <= 0) {
      await handleRemove(itemId);
      return;
    }

    try {
      await updateCartItem(itemId, newQuantity);
      console.log('Successfully updated item quantity');
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const orderTotal = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || item.count || 1)), 0);
  const summaryTotal = orderTotal + DELIVERY_COST;

  const isLoading = loading || localLoading;

  // Si el carrito está vacío, mostrar el estado vacío
  if (cartItems.length === 0) {
    return (
      <div className="bag-empty-container">
        <div className="bag-header">
          <button className="bag-back-btn" onClick={() => navigate('/home')}>
            <img src="/CloseIcon.png" alt="Close" />
          </button>
          <h1 className="bag-title">MY BAG</h1>
        </div>

        <div className="bag-empty-content">
          <div className="bag-empty-icon">
            <img src="/BagEmpty.png" alt="Empty bag" className="empty-bag-image" />
          </div>
          
          <h2 className="bag-empty-title">Nothing here yet!</h2>
          <p className="bag-empty-text">Looks like your bag is empty.</p>
          
          <button 
            className="bag-go-shopping-btn"
            onClick={() => navigate('/home')}
          >
            Go shopping
          </button>
        </div>
      </div>
    );
  }

  // Si hay productos en el carrito, mostrar el carrito normal
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
          cartItems.map((item, index) => (
            <div className="bag-item" key={`${item._id}-${index}`}>
              <img
                src={item.image?.startsWith('http') ? item.image : `${import.meta.env.VITE_APP_API_URL.replace('/api', '')}${item.image || item.url}`}
                alt={item.name}
                className="bag-item-img"
                onError={e => { e.target.onerror = null; e.target.src = '/src/assets/Icons/ImagePlaceholder.png'; }}
              />
              <div className="bag-item-info">
                <div className="bag-item-header">
                  <div className="bag-item-title">{item.name}</div>
                  <button 
                    className="bag-item-remove" 
                    onClick={() => handleRemove(item._id)}
                    disabled={loading}>
                    <img src="/Trash.png" alt="Delete" />
                  </button>
                </div>
                <div className="bag-item-footer">
                  <div className="bag-item-price">€ {item.price.toFixed(2)}</div>
                  <div className="bag-item-counter">
                    <button 
                      onClick={() => handleCountChange(item._id, -1)}
                      disabled={loading}
                    >
                      -
                    </button>
                    <span>{item.quantity || item.count || 1}</span>
                    <button 
                      onClick={() => handleCountChange(item._id, 1)}
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
