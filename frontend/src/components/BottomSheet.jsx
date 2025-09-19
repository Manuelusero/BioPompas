import './BottomSheet.css';
import { useState, useEffect } from 'react';
import { useCart } from '../api/CartContext';
import PropTypes from 'prop-types'; // Agregar PropTypes

const BottomSheet = ({ isOpen, onClose, product }) => {
  const { addToCart, loading } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(null);
  const [currentY, setCurrentY] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen]);

  // Función para manejar URLs de imágenes sin dependencias externas
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-image.jpg';
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${import.meta.env.VITE_APP_API_URL?.replace('/api', '') || 'http://localhost:5001'}${cleanPath}`;
  };

  // Verificar que el producto existe antes de hacer cualquier cosa
  if (!product) {
    return null;
  }

  const handleAddToCart = () => {
    if (product && (product._id || product.id)) {
      const productWithId = {
        ...product,
        _id: product._id || product.id
      };
      addToCart(productWithId, quantity);
      onClose();
    }
  };

  const handleTouchStart = (e) => {
    if (!isOpen) return;
    setIsDragging(false);
    setStartY(e.touches[0].clientY);
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (!isOpen || startY === null) return;
    
    const deltaY = e.touches[0].clientY - startY;
    if (deltaY > 10) {
      e.preventDefault();
    }
    
    setIsDragging(true);
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!isOpen || !isDragging || startY === null) return;
    
    const deltaY = currentY - startY;
    const threshold = 100;
    
    if (deltaY > threshold) {
      onClose();
    }
    
    setIsDragging(false);
    setStartY(null);
    setCurrentY(null);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className={`bottom-sheet-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        className={`bottom-sheet ${isOpen ? 'open' : ''}`}
        style={{
          transform: isDragging && startY !== null 
            ? `translateY(${Math.max(0, currentY - startY)}px)`
            : 'translateY(0)',
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag Handle */}
        <div 
          className="bottom-sheet-handle"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />

        {/* Content */}
        <div className="bottom-sheet-content">
          {/* Close button */}
          <button 
            className="bottom-sheet-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>

          <div className="bottom-sheet-product">
            <img 
              src={getImageUrl(product.image || product.url)}
              alt={product.name || 'Product'}
              className="bottom-sheet-product-image"
              onError={(e) => {
                console.log('Error loading image:', e.target.src);
                e.target.src = '/placeholder-image.jpg';
              }}
            />
            <div className="bottom-sheet-product-info">
              <h3 className="bottom-sheet-product-name">{product.name || 'Sin nombre'}</h3>
              <p className="bottom-sheet-product-price">€{(product.price || 0).toFixed(2)}</p>
            </div>
          </div>

          <div className="bottom-sheet-quantity">
            <span className="bottom-sheet-quantity-label">Quantity</span>
            <div className="bottom-sheet-quantity-controls">
              <button 
                className="bottom-sheet-quantity-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="bottom-sheet-quantity-value">{quantity}</span>
              <button 
                className="bottom-sheet-quantity-btn"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="bottom-sheet-actions">
            <button 
              className="bottom-sheet-continue-btn"
              onClick={onClose}
            >
              Continue Shopping
            </button>
            
            <button 
              className="bottom-sheet-add-btn"
              onClick={handleAddToCart}
              disabled={loading || !(product._id || product.id)}
            >
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                <>
                  <img src="/Cart.svg" alt="Cart" className="bottom-sheet-cart-icon" />
                  Add to Cart - €{((product.price || 0) * quantity).toFixed(2)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Agregar PropTypes para resolver los errores de validación
BottomSheet.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.number,
    image: PropTypes.string,
    url: PropTypes.string
  })
};

export default BottomSheet;