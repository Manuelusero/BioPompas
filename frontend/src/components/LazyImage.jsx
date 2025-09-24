import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import './LazyImage.css';

function LazyImage({ src, alt, className = '', skeletonClassName = '' }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef();

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div ref={imgRef} className={`lazy-image-container ${className}`}>
      {/* MODIFICADO: Skeleton más simple */}
      {!isLoaded && (
        <div className={`skeleton-placeholder ${skeletonClassName}`}>
          <div className="skeleton-shimmer"></div>
        </div>
      )}
      
      {/* MODIFICADO: Cargar imagen inmediatamente sin observer */}
      <img
        src={src}
        alt={alt}
        className={`lazy-image ${isLoaded ? 'loaded' : 'loading'}`}
        onLoad={handleLoad}
        style={{ opacity: isLoaded ? 1 : 0 }}
        loading="eager"
        decoding="async"
      />
    </div>
  );
}

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  skeletonClassName: PropTypes.string
};

export default LazyImage;
        