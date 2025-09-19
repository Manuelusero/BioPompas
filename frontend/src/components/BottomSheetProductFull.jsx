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

  // Drag/Touch logic mejorado - hacer toda la barra superior draggable
  const handleDragStart = (e) => {
    // Expandir área draggable para incluir toda la barra superior y el handle
    const target = e.target;
    const isHandle = target.classList.contains('bottom-sheet-handle') || 
                    target.classList.contains('bottom-sheet-handle-expanded') ||
                    target.classList.contains('bottom-sheet-draggable-bar');
    
    if (!isHandle) return;
    
    dragging.current = true;
    startY.current = e.touches ? e.touches[0].clientY : e.clientY;
    currentY.current = startY.current;
    
    // Prevenir comportamientos por defecto
    e.preventDefault();
    e.stopPropagation();
    
    document.addEventListener('touchmove', handleDragMove, { passive: false });
    document.addEventListener('touchend', handleDragEnd);
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  };

  const handleDragMove = (e) => {
    if (!dragging.current) return;
    
    e.preventDefault(); // Prevenir scroll
    
    currentY.current = e.touches ? e.touches[0].clientY : e.clientY;
    const diff = currentY.current - startY.current;
    
    if (sheetRef.current) {
      // Solo permitir arrastrar hacia abajo
      const translateY = Math.max(diff, 0);
      sheetRef.current.style.transform = `translateY(${translateY}px)`;
      sheetRef.current.style.transition = 'none';
    }
  };

  const handleDragEnd = () => {
    if (!dragging.current) return;
    
    dragging.current = false;
    const diff = currentY.current - startY.current;
    
    if (sheetRef.current) {
      sheetRef.current.style.transition = 'transform 0.3s ease-out';
      sheetRef.current.style.transform = '';
    }
    
    // Umbrales de drag mejorados
    if (diff > 100) {
      // Cerrar si arrastra más de 100px hacia abajo
      onClose();
      setExpanded(false);
    } else if (diff > 50 && expanded) {
      // Si está expandido y arrastra más de 50px, volver a compacto
      setExpanded(false);
    } else if (diff < -50 && !expanded) {
      // Si está compacto y arrastra hacia arriba más de 50px, expandir
      setExpanded(true);
    }
    
    // Limpiar event listeners
    document.removeEventListener('touchmove', handleDragMove);
    document.removeEventListener('touchend', handleDragEnd);
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
  };

  // Cerrar al hacer clic en el overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
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
    <div className="bottom-sheet-overlay" onClick={handleOverlayClick}>
      <div
        className={`bottom-sheet${expanded ? ' expanded' : ''}`}
        ref={sheetRef}
      >
        {expanded ? (
          <>
            <div className="bottom-sheet-expanded-content">
              {/* Barra draggable para estado expandido */}
              <div 
                className="bottom-sheet-draggable-bar"
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
              >
                <div className="bottom-sheet-handle-expanded" />
              </div>
              
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
              {/* Botón Continue shopping siempre visible */}
              <button className="bottom-sheet-close" onClick={onClose}>
                Continue shopping
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Barra draggable para estado compacto */}
            <div 
              className="bottom-sheet-draggable-bar"
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
            >
              <div className="bottom-sheet-handle" />
            </div>
            
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
              {/* Botón Continue shopping siempre visible en modo compacto también */}
              <button className="bottom-sheet-close" onClick={onClose}>
                Continue shopping
              </button>
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
