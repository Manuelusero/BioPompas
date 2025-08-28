import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './CategoryPage.css';
import ArrowLeftIcon from '/src/assets/Icons/ArrowLeftIcon.png';
import BottomSheetProductFull from '../components/BottomSheetProductFull';

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [bottomSheetCount, setBottomSheetCount] = useState(1);
  // Eliminado cart, solo usamos cartCount
  const [cartCount, setCartCount] = useState(0);

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

  // Unificar contador global SOLO localStorage
  useEffect(() => {
    const fetchCart = () => {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        // Solo contar productos válidos
        const cartArr = JSON.parse(storedCart).filter(item => item._id && item.count > 0);
        setCartCount(cartArr.reduce((sum, item) => sum + item.count, 0));
      } else {
        setCartCount(0);
      }
    };
    fetchCart();
    window.addEventListener('cartUpdated', fetchCart);
    window.addEventListener('storage', fetchCart);
    return () => {
      window.removeEventListener('cartUpdated', fetchCart);
      window.removeEventListener('storage', fetchCart);
    };
  }, []);

  if (loading) return <div className="category-loading">Loading...</div>;
  if (error) return <div className="category-error">{error}</div>;

  const handleCardClick = (product) => {
    setSelectedProductId(product._id);
    setBottomSheetOpen(true);
    setBottomSheetCount(1);
  };

  const handleCloseBottomSheet = () => {
    setBottomSheetOpen(false);
  };

  const handleAddToCart = (product, count) => {
    const productId = product._id;
    // Siempre localStorage
    const storedCart = localStorage.getItem('cart');
    let cartArr = storedCart ? JSON.parse(storedCart) : [];
    // Limpiar productos sin _id o count <= 0
    cartArr = cartArr.filter(item => item._id && item.count > 0);
    const existingIndex = cartArr.findIndex(item => item._id === productId);
    if (existingIndex !== -1) {
      cartArr[existingIndex].count = (cartArr[existingIndex].count || 1) + count;
    } else {
      cartArr.push({ ...product, count });
    }
    // Limpiar de nuevo por si algún producto quedó con count <= 0
    cartArr = cartArr.filter(item => item._id && item.count > 0);
    localStorage.setItem('cart', JSON.stringify(cartArr));
    window.dispatchEvent(new Event('cartUpdated'));
    setBottomSheetOpen(false);
  };

  return (
    <div className="category-page-container">
      <div className="category-header">
        <a href="/categories" className="category-back category-header-left">
          <img src={ArrowLeftIcon} alt="Back" className="arrowIcon" />
        </a>
        <h2 className="category-title category-header-center">{category}</h2>
        <a href="/bag" className="categoryCartIcon category-header-right">
          <img src="/src/assets/Icons/Cart.svg" alt="Carrito" className="categoryCartIconImg" />
          {cartCount > 0 && (
            <span className="categoryCartBadge">{cartCount}</span>
          )}
        </a>
      </div>
      <div className="category-products-list">
        {products.length === 0 ? (
          <div className="category-no-products">No products found.</div>
        ) : (
          products.map(product => (
            <div className="category-product-card" key={product._id} onClick={() => handleCardClick(product)}>
              <img
                src={product.image?.startsWith('http') ? product.image : `${import.meta.env.VITE_APP_API_URL.replace('/api', '')}${product.image || product.url}`}
                alt={product.name}
                className="category-product-image"
                onError={e => { e.target.onerror = null; e.target.src = '/src/assets/Icons/ImagePlaceholder.png'; }}
              />
              <div className="category-product-info">
                <h3>{product.name}</h3>
                <p><span>€</span>{Number(product.price).toFixed(2)}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <BottomSheetProductFull
        productId={selectedProductId}
        products={products}
        open={bottomSheetOpen}
        onClose={handleCloseBottomSheet}
        onAdd={handleAddToCart}
        count={bottomSheetCount}
        setCount={setBottomSheetCount}
        cartCount={cartCount}
      />
      <nav className="bottom-navbar">
        <a href="/home" className="nav-icon" aria-label="Home">
          <img src="/src/assets/Icons/HomeIcon.png" alt="Home" />
        </a>
        <a href="/search" className="nav-icon" aria-label="Search">
          <img src="/src/assets/Icons/SearchIcon.png" alt="Search" />
        </a>
        <a href="/login" className="nav-icon" aria-label="Avatar">
          <img src="/src/assets/Icons/AvatarIcon.png" alt="Avatar" />
        </a>
      </nav>
    </div>
  );
}


export default CategoryPage;
