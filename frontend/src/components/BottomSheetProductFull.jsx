import { useMemo, useRef, useState, useEffect } from "react";
import './BottomSheetProduct.css';
import PropTypes from 'prop-types';
import { getImageUrl } from '../utils/api.js';

const BottomSheetProductFull = ({ productId, products, open, onClose, onAdd, count, setCount }) => {
  const [expanded, setExpanded] = useState(false);

  // Cuando cambia el producto o se abre el modal, siempre empieza en compacto
  useEffect(() => {
    setExpanded(false);
  }, [productId, open]);

  const sheetRef = useRef();
  const startY = useRef(null);
  const currentY = useRef(null);
  const dragging = useRef(false);

  // Busca el producto completo por id
  const product = useMemo(() => {
    if (!productId || !products) return null;
    return products.find(p => p.id === productId || p._id === productId) || null;
  }, [productId, products]);

  // Drag/Touch logic SOLO en el handle
  const handleDragStart = (e) => {
    // Solo si el target es el handle (compacto o expandido)
    if (!e.target.classList.contains('bottom-sheet-handle') && 
        !e.target.classList.contains('bottom-sheet-handle-expanded')) return;
    dragging.current = true;
    if (e.touches) {
      startY.current = e.touches[0].clientY;
    } else {
      startY.current = e.clientY;
    }
    document.addEventListener('touchmove', handleDragMove, { passive: false });
    document.addEventListener('touchend', handleDragEnd);
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  };

  const handleDragMove = (e) => {
    if (!dragging.current) return;
    if (e.touches) {
      currentY.current = e.touches[0].clientY;
    } else {
      currentY.current = e.clientY;
    }
    const diff = currentY.current - startY.current;
    if (sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${Math.max(diff, 0)}px)`;
    }
  };

  const handleDragEnd = (e) => {
    if (!dragging.current) return;
    dragging.current = false;
    if (e && e.touches && e.touches.length > 0) {
      currentY.current = e.touches[0].clientY;
    } else if (e && typeof e.clientY === 'number') {
      currentY.current = e.clientY;
    }
    const diff = currentY.current - startY.current;
    if (diff > 120) {
      // Si baja mucho, cerrar el bottom sheet
      if (typeof onClose === 'function') onClose();
      setExpanded(false);
    } else if (diff > 60) {
      setExpanded(false); // Compacto
    } else if (diff < -60) {
      setExpanded(true); // Expandido
    }
    if (sheetRef.current) {
      sheetRef.current.style.transform = '';
    }
    document.removeEventListener('touchmove', handleDragMove);
    document.removeEventListener('touchend', handleDragEnd);
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
  };

  // Bloquear scroll del body cuando el Bottom Sheet está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open || !product) return null;

  return (
    <div className="bottom-sheet-overlay">
      <div
        className={`bottom-sheet${expanded ? ' expanded' : ''}`}
        ref={sheetRef}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        onClick={e => e.stopPropagation()}
      >
        {expanded ? (
          <>
            <div className="bottom-sheet-expanded-content">
              <div className="bottom-sheet-handle-expanded" />
              <div className="bottom-sheet-img-container full expanded-img">
                <img 
                  src={getImageUrl(product.image)} 
                  alt={product.name} 
                  className="bottom-sheet-img full expanded-img"
                  onError={(e) => {
                    console.log('Error loading image:', e.target.src);
                    e.target.style.display = 'none';
                  }}
                />
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
                {product.description && (
                  <div className="bottom-sheet-about">
                    <div className="bottom-sheet-about-title">About</div>
                    <div className="bottom-sheet-about-desc">{product.description}</div>
                  </div>
                )}
              </div>
              <div className="bottom-sheet-add-row expanded">
                <button className="bottom-sheet-add" onClick={() => onAdd(product, count)}>
                  <span className="bottom-sheet-add-icon">
                    <img src="/Cart.svg" alt="Carrito" />
                  </span>
                  <span className="bottom-sheet-add-text">Add to bag</span>
                </button>
              </div>
              <button className="bottom-sheet-close" onClick={onClose}>Continue shopping</button>
            </div>
          </>
        ) : (
          <>
            <div className="bottom-sheet-img-container full">
              <img 
                src={getImageUrl(product.image)} 
                alt={product.name} 
                className="bottom-sheet-img full"
                onError={(e) => {
                  console.log('Error loading image:', e.target.src);
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div className="bottom-sheet-expanded-content compact">
              <div className="bottom-sheet-handle" />
              <div className="bottom-sheet-info compact">
                <div className="bottom-sheet-title-price">
                  <div className="bottom-sheet-title">{product.name}</div>
                  <div className="bottom-sheet-counter">
                    <button onClick={() => setCount(Math.max(1, count - 1))}>-</button>
                    <span>{count}</span>
                    <button onClick={() => setCount(count + 1)}>+</button>
                  </div>
                </div>
                <div className="bottom-sheet-price">€ {product.price}</div>
              </div>
              <div className="bottom-sheet-add-row compact">
                <button className="bottom-sheet-add" onClick={() => onAdd(product, count)}>
                  <span className="bottom-sheet-add-icon">
                    <img src="/Cart.svg" alt="Carrito" />
                  </span>
                  <span className="bottom-sheet-add-text">Add to bag</span>
                </button>
              </div>
            </div>
          </>
        )}
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
