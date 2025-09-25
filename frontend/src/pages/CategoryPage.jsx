import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Categories.css'; 
import BottomSheetProductFull from '../components/BottomSheetProductFull';
import { useCart } from '../api/CartContext';

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart, cartCount } = useCart();
  // Usar verificación directa de localStorage temporalmente
  const isLoggedIn = !!localStorage.getItem('token');

  // Estados para BottomSheet
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [bottomSheetCount, setBottomSheetCount] = useState(1);

  // NUEVO: Función para capitalizar primera letra
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_APP_API_URL}/products`)
      .then(response => response.json())
      .then(data => {
        const filtered = data.filter(p => 
          p.category && p.category.toLowerCase().includes(category.toLowerCase())
        );
        setProducts(filtered);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setError('Error loading products');
        setLoading(false);
      });
  }, [category]);

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

  // Agregar función para manejar clic en avatar
  const handleAvatarClick = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      alert('Debes iniciar sesión para acceder a tu perfil.');
      navigate('/login', { state: { from: 'profile' } });
    }
  };

  if (loading) return <div className="category-loading">Loading...</div>;
  if (error) return <div className="category-error">{error}</div>;

  return (
    <div className="categoriesPage">
      <div className="categoriesHeader">
        <a href="/categories" className="categoriesBack">
          <img src="/ArrowLeftIcon.png" alt="Back" className="arrowIcon" />
        </a>
        <h2 className="categoriesTitle">
          {capitalizeFirstLetter(category || '')}
        </h2>
        <a href="/bag" className="categoriesCartIcon">
          <img src="/Cart.svg" alt="Carrito" className="categoriesCartIconImg" />
          {cartCount > 0 && (
            <span className="categoriesCartBadge">{cartCount}</span>
          )}
        </a>
      </div>
      
      <div className="categories-products">
        {products.length === 0 ? (
          <div className="category-no-products">No products found.</div>
        ) : (
          products.map(product => (
            <div 
              key={product._id || product.id} 
              className="categories-product-card"
              onClick={() => handleProductClick(product)}
            >
              <img 
                src={product.image?.startsWith('http') 
                  ? product.image 
                  : `${import.meta.env.VITE_APP_API_URL.replace('/api', '')}${product.image}`
                }
                alt={product.name}
                className="categories-product-image"
                loading="eager"
              />
              <div className="categories-product-info">
                <h3 className="categories-product-name">{product.name}</h3>
                <p className="categories-product-price">€{Number(product.price).toFixed(2)}</p>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* BottomSheet para productos */}
      <BottomSheetProductFull
        productId={selectedProductId}
        products={products} // Cambiar de filteredProducts a products
        open={bottomSheetOpen}
        onClose={handleCloseBottomSheet}
        onAdd={handleAddFromBottomSheet}
        count={bottomSheetCount}
        setCount={setBottomSheetCount}
      />
      
      <nav className="bottom-navbar">
        <a href="/home" className="nav-icon" aria-label="Home">
          <img src="/HomeIcon.png" alt="Home" />
        </a>
        <a href="/search" className="nav-icon" aria-label="Search">
          <img src="/SearchIcon.png" alt="Search" />
        </a>
        <button onClick={handleAvatarClick} className="nav-icon" aria-label="Avatar"> {/* Cambiar a button con onClick */}
          <img src="/AvatarIcon.png" alt="Avatar" />
        </button>
      </nav>
    </div>
  );
};


export default CategoryPage;
