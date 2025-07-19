import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
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
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/products/category/${category}`);
        setProducts(response.data);
      } catch (err) {
        setError('Error loading products' + (err?.response?.data?.error ? ': ' + err.response.data.error : ''));
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  if (loading) return <div className="category-loading">Loading...</div>;
  if (error) return <div className="category-error">{error}</div>;

  const handleCardClick = (product) => {
    setSelectedProductId(product.id || product._id);
    setBottomSheetOpen(true);
    setBottomSheetCount(1);
  };

  const handleCloseBottomSheet = () => {
    setBottomSheetOpen(false);
  };

  const handleAddToCart = (product, count) => {
    const productId = product.id || product._id;
    const existingIndex = cart.findIndex(item => (item.id || item._id) === productId);
    let newCart;
    if (existingIndex !== -1) {
      newCart = cart.map((item, idx) =>
        idx === existingIndex ? { ...item, count: item.count + count } : item
      );
    } else {
      newCart = [...cart, { ...product, count }];
    }
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartUpdated'));
    setBottomSheetOpen(false);
  };

  return (
    <div className="category-page-container">
      <div className="category-header">
        <a href="/categories" className="category-back">
          <img src={ArrowLeftIcon} alt="Back" className="arrowIcon" />
        </a>
        <h2 className="category-title">{category} Products</h2>
      </div>
      <div className="category-products-list">
        {products.length === 0 ? (
          <div className="category-no-products">No products found.</div>
        ) : (
          products.map(product => (
            <div className="category-product-card" key={product.id} onClick={() => handleCardClick(product)}>
              <img
                src={product.image?.startsWith('http') ? product.image : `http://localhost:5001${product.image || product.url}`}
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
};

export default CategoryPage;
