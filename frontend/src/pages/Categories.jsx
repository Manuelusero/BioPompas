import './Categories.css';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BottomSheetProductFull from '../components/BottomSheetProductFull';
import { useCart } from '../api/CartContext';
import { getImageUrl, getApiUrl } from '../utils/api.js';

const Categories = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { cartCount, addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [bottomSheetCount, setBottomSheetCount] = useState(1);

  // NUEVO: Agregar verificación de login
  const isLoggedIn = !!localStorage.getItem('token');

  // NUEVO: Función para capitalizar primera letra
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  // MODIFICADO: Función handleAvatarClick ahora funciona correctamente
  const handleAvatarClick = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      alert('Debes iniciar sesión para acceder a tu perfil.');
      navigate('/login', { state: { from: 'profile' } });
    }
  };

  // MODIFICADO: Solo un useEffect para obtener productos de categoría
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (!category) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${getApiUrl()}/products/category/${category.toUpperCase()}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Category products received:', data);
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching category products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [category]); // MODIFICADO: Solo depende de category

  // Scroll automático al top cuando se carga la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Manejar clic en producto para abrir BottomSheet
  const handleProductClick = (product) => {
    setSelectedProductId(product._id || product.id);
    setBottomSheetCount(1);
    setBottomSheetOpen(true);
  };

  // Cerrar BottomSheet
  const handleCloseBottomSheet = () => {
    setBottomSheetOpen(false);
    setSelectedProductId(null);
    setBottomSheetCount(1);
  };

  // Agregar producto al carrito desde BottomSheet
  const handleAddFromBottomSheet = async (product, count) => {
    try {
      await addToCart(product, count);
      setBottomSheetOpen(false);
      setSelectedProductId(null);
      setBottomSheetCount(1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="categories-page">
        <div className="categories-header">
          <Link to="/home" className="categories-back">
            <img src="/ArrowLeftIcon.png" alt="Back" />
          </Link>
          <h1 className="categories-title">Loading...</h1>
          <div className="categories-cart-container">
            <Link to="/bag">
              <img src="/Cart.svg" alt="Cart" className="categories-cart" />
              {cartCount > 0 && (
                <span className="cart-badge-categories">{cartCount}</span>
              )}
            </Link>
          </div>
        </div>
        <div className="loading-message">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="categories-page">
      {/* Header con título capitalizado */}
      <div className="categories-header">
        <Link to="/home" className="categories-back">
          <img src="/ArrowLeftIcon.png" alt="Back" />
        </Link>
        <h1 className="categories-title">
          {capitalizeFirstLetter(category || 'Categories')}
        </h1>
        <div className="categories-cart-container">
          <Link to="/bag">
            <img src="/Cart.svg" alt="Cart" className="categories-cart" />
            {cartCount > 0 && (
              <span className="cart-badge-categories">{cartCount}</span>
            )}
          </Link>
        </div>
      </div>

      {/* Grid de productos 2x2 */}
      <div className="categories-products-grid">
        {products.map((product) => (
          <div 
            className="category-product-card" 
            key={product._id || product.id} 
            onClick={() => handleProductClick(product)}
          >
            <img 
              src={getImageUrl(product.image)} 
              alt={product.name}
              className="category-product-image"
              loading="eager"
            />
            <div className="category-product-info">
              <div className="category-product-name">{product.name}</div>
              <div className="category-product-price">
                €{Number(product.price).toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje si no hay productos */}
      {products.length === 0 && !loading && (
        <div className="no-products-message">
          No products found in this category.
        </div>
      )}

      {/* Bottom Sheet para detalles del producto */}
      <BottomSheetProductFull
        productId={selectedProductId}
        products={products}
        open={bottomSheetOpen}
        onClose={handleCloseBottomSheet}
        onAdd={handleAddFromBottomSheet}
        count={bottomSheetCount}
        setCount={setBottomSheetCount}
      />

      {/* Navbar inferior */}
      <nav className="bottom-navbar">
        <Link to="/home" className="nav-icon" aria-label="Home">
          <img src="/HomeIcon.png" alt="Home" />
        </Link>
        <Link to="/search" className="nav-icon" aria-label="Search">
          <img src="/SearchIcon.png" alt="Search" />
        </Link>
        <button onClick={handleAvatarClick} className="nav-icon" aria-label="Profile">
          <img src="/AvatarIcon.png" alt="Profile" />
        </button>
      </nav>
    </div>
  );
};

export default Categories;