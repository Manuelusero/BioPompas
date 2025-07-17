import { useMemo, useRef } from "react";
import './BottomSheetProduct.css';
import PropTypes from 'prop-types';

const BottomSheetProductFull = ({ productId, products, open, onClose, onAdd, count, setCount }) => {

  const sheetRef = useRef();
  const startY = useRef(null);
  const currentY = useRef(null);
  const dragging = useRef(false);

  // Busca el producto completo por id
  const product = useMemo(() => {
    if (!productId || !products) return null;
    return products.find(p => p.id === productId || p._id === productId) || null;
  }, [productId, products]);

  // Drag/Touch logic
  const handleTouchStart = (e) => {
    dragging.current = true;
    startY.current = e.touches ? e.touches[0].clientY : e.clientY;
  };
  const handleTouchMove = (e) => {
    if (!dragging.current) return;
    currentY.current = e.touches ? e.touches[0].clientY : e.clientY;
    const diff = currentY.current - startY.current;
    if (diff > 0 && sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${diff}px)`;
    }
  };
  const handleTouchEnd = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (currentY.current - startY.current > 80) {
      onClose();
    } else if (sheetRef.current) {
      sheetRef.current.style.transform = '';
    }
  };

  if (!open || !product) return null;

  return (
    <div className="bottom-sheet-overlay" onClick={onClose}>
      <div
        className="bottom-sheet"
        ref={sheetRef}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={e => e.stopPropagation()}
      >
        <div className="bottom-sheet-handle" />
        <div className="bottom-sheet-img-container">
          <img src={product.image && (product.image.startsWith('http') ? product.image : 'http://localhost:5001' + product.image)} alt={product.name} className="bottom-sheet-img" />
        </div>
        <div className="bottom-sheet-info">
          <div className="bottom-sheet-title-price">
            <div className="bottom-sheet-title">{product.name}</div>
            <div className="bottom-sheet-counter">
              <button onClick={() => setCount(Math.max(1, count - 1))}>-</button>
              <span>{count}</span>
              <button onClick={() => setCount(count + 1)}>+</button>
            </div>
          </div>
          <div className="bottom-sheet-price">€ {product.price}</div>
          <div className="bottom-sheet-about">
            <div className="bottom-sheet-about-title">About</div>
            <div className="bottom-sheet-about-desc">{product.description}</div>
          </div>
        </div>
        <div className="bottom-sheet-add-row">
          <button className="bottom-sheet-add" onClick={() => onAdd(product, count)}>
            <span className="bottom-sheet-add-icon">
              <img src="/src/assets/Icons/Cart.svg" alt="Carrito" />
            </span>
            <span className="bottom-sheet-add-text">Add to bag</span>
          </button>
        </div>
        <button className="bottom-sheet-close" onClick={onClose}>Continue shopping</button>
      </div>
    </div>
  );
};

BottomSheetProductFull.propTypes = {
  productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  products: PropTypes.array.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
  setCount: PropTypes.func.isRequired,
};

export default BottomSheetProductFull;
