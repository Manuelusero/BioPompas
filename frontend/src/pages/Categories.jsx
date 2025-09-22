import './Categories.css';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BottomSheetProductFull from '../components/BottomSheetProductFull';
import { useCart } from '../api/CartContext';
import { useAuth } from '../hooks/useAuth'; // Agregar import


// Cart badge header component
function CategoriesHeaderWithCartBadge() {
  const { cartCount } = useCart();
  
  return (
    <div className="categoriesHeader">
      <Link to="/home" className="categoriesBack">
        <img src="/ArrowLeftIcon.png" alt="Back" className="arrowIcon" />
      </Link>
      <h2 className="categoriesTitle">Categories</h2>
      <Link to="/bag" className="categoriesCartIcon">
        <img src="/Cart.svg" alt="Carrito" className="categoriesCartIconImg" />
        {cartCount > 0 && (
          <span className="categoriesCartBadge">{cartCount}</span>
        )}
      </Link>
    </div>
  );
}

const Categories = () => {
  const navigate = useNavigate(); // Agregar useNavigate aquí en el componente principal
  const { isLoggedIn } = useAuth(); // Usar hook
  const [categories, setCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const { addToCart } = useCart();
  
  // Estados para BottomSheet
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [bottomSheetCount, setBottomSheetCount] = useState(1);
  const [allProducts, setAllProducts] = useState([]);

  // Agregar función handleAvatarClick en el componente principal
  const handleAvatarClick = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      alert('Debes iniciar sesión para acceder a tu perfil.');
      navigate('/login', { state: { from: 'profile' } });
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/categories`);
        console.log('Categories response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }
        
        const data = await response.json();
        console.log('Categories data received:', data);
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error al obtener categories:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // Obtener todos los productos para el BottomSheet y para mostrar
  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/products`);
        setAllProducts(response.data);
        // Mostrar algunos productos destacados en la página principal de categorías
        setCategoryProducts(response.data.slice(0, 6)); // Mostrar solo 6 productos
      } catch (error) {
        console.error('Error fetching all products:', error);
        setAllProducts([]);
        setCategoryProducts([]);
      }
    };

    getAllProducts();
  }, []);

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

  return (
    <div className="categories-container">
      <CategoriesHeaderWithCartBadge />
      <div className="categoriesGrid">
        {categories.map(cat => (
          <Link to={`/category/${encodeURIComponent(cat.name.split(',')[0].trim())}`} className="categoryCard" key={cat._id} style={{ position: 'relative' }}>
            <img src={`${import.meta.env.VITE_APP_API_URL.replace('/api', '')}${cat.image}`} alt={cat.name} />
          </Link>
        ))}
      </div>

      {/* Mostrar productos destacados solo si hay productos */}
      {categoryProducts.length > 0 && (
        <>
          <h3 className="featured-products-title">Featured Products</h3>
          <div className="categories-products">
            {categoryProducts.map((product) => (
              <div 
                key={product._id || product.id} 
                className="categories-product-card"
                onClick={() => handleProductClick(product)} // Agregar onClick
              >
                <img 
                  src={product.image?.startsWith('http') 
                    ? product.image 
                    : `${import.meta.env.VITE_APP_API_URL.replace('/api', '')}${product.image}`
                  }
                  alt={product.name}
                  className="categories-product-image"
                />
                <div className="categories-product-info">
                  <h3 className="categories-product-name">{product.name}</h3>
                  <p className="categories-product-price">€{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

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

      {/* BottomSheet para productos */}
      <BottomSheetProductFull
        productId={selectedProductId}
        products={allProducts}
        open={bottomSheetOpen}
        onClose={handleCloseBottomSheet}
        onAdd={handleAddFromBottomSheet}
        count={bottomSheetCount}
        setCount={setBottomSheetCount}
      />
    </div>
  );
};

export default Categories;