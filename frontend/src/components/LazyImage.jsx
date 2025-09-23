import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types'; // NUEVO: Importar PropTypes
import './LazyImage.css';

// MODIFICADO: Cambiar la sintaxis para evitar el error de desestructuración
function LazyImage(props) {
  const src = props.src;
  const alt = props.alt;
  const className = props.className || '';
  const skeletonClassName = props.skeletonClassName || '';
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div ref={imgRef} className={`lazy-image-container ${className}`}>
      {!isLoaded && (
        <div className={`skeleton-placeholder ${skeletonClassName}`}>
          <div className="skeleton-shimmer"></div>
        </div>
      )}
      
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`lazy-image ${isLoaded ? 'loaded' : 'loading'}`}
          onLoad={handleLoad}
          style={{ display: isLoaded ? 'block' : 'none' }}
        />
      )}
    </div>
  );
}

// NUEVO: Agregar PropTypes para evitar errores de ESLint
LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  skeletonClassName: PropTypes.string
};

export default LazyImage;
