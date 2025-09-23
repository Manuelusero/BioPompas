import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomSheetProductFull from '../components/BottomSheetProductFull';
import { useCart } from '../api/CartContext';
import "./Search.css";

const Search = () => {
  const navigate = useNavigate();
  const { addToCart, cartCount } = useCart();
  // Usar verificación directa de localStorage temporalmente
  const isLoggedIn = !!localStorage.getItem('token');
  
  const [query, setQuery] = useState("");
  const [suggested, setSuggested] = useState([]);
  const [results, setResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [bottomSheetCount, setBottomSheetCount] = useState(1);

  // Get product suggestions on mount
  useEffect(() => {
    const fetchSuggested = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/products?isFeatured=true`);
        console.log('Suggested products response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }
        
        const data = await response.json();
        console.log('Suggested products data received:', data);
        setSuggested(Array.isArray(data) ? data.slice(0, 4) : []);
      } catch (error) {
        console.error("Error al obtener productos sugeridos:", error);
        setSuggested([]);
      }
    };
    
    fetchSuggested();
  }, []);

  // Search products as user types
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setError("");
      return;
    }
    
    const searchProducts = async () => {
      setLoading(true);
      setError("");
      
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/products`);
        console.log('Search products response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }
        
        const products = await response.json();
        console.log('Search products data received:', products);
        
        setAllProducts(Array.isArray(products) ? products : []);
        const q = query.trim().toLowerCase();
        const filtered = (Array.isArray(products) ? products : []).filter(prod =>
          prod.name?.toLowerCase().includes(q) ||
          prod.description?.toLowerCase().includes(q) ||
          prod.category?.toLowerCase().includes(q)
        );
        setResults(filtered);
      } catch (error) {
        console.error("Error loading products:", error);
        setError("Error loading products");
        setResults([]);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    searchProducts();
  }, [query]);

  const handleCardClick = (product) => {
    console.log('Product clicked:', product);
    const productId = product._id || product.id;
    setSelectedProductId(productId);
    setBottomSheetOpen(true);
    setBottomSheetCount(1);
  };

  const handleCloseBottomSheet = () => {
    setBottomSheetOpen(false);
  };

  const handleAddToCart = async (product, count) => {
    try {
      await addToCart(product, count); // Usar CartContext
      setBottomSheetOpen(false);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const clearSearch = () => {
    setQuery("");
  };

  const handleCartClick = () => {
    navigate('/bag');
  };

  const handleAvatarClick = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      alert('Debes iniciar sesión para acceder a tu perfil.');
      navigate('/login', { state: { from: 'profile' } });
    }
  };

  return (
    <div className="searchPage">
      <div className="searchHeaderRow">
        <div className="searchInputContainer">
          <img src="/SearchIcon.png" alt="Search" className="searchIcon" />
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="searchInput"
          />
          {query.trim() && (
            <img 
              src="/ClearIcon.png" 
              alt="Clear search" 
              className="clearSearchIcon"
              onClick={clearSearch}
            />
          )}
        </div>
        <div className="search-cart-icon-container">
          <img 
            src="/Cart.svg" 
            alt="Cart" 
            className="searchCartIcon"
            onClick={handleCartClick}
          />
          {cartCount > 0 && (
            <span className="cart-badge-search">{cartCount}</span>
          )}
        </div>
      </div>
      
      {/* Product suggestions */}
      {suggested.length > 0 && !query.trim() && (
        <div className="suggestionContainer">
          <div className="suggestionPills">
            {["Soap", "Laundry", "Brush", "Bath bombs", "Top picks", "Essential oils", "Toothbrush", "Bottle", "Sponge", "Refillable", "Detergent"].map((suggestion, index) => (
              <span
                key={index}
                className="suggestionPill"
                onClick={() => setQuery(suggestion)}
              >
                {suggestion}
              </span>
            ))}
          </div>
        </div>
      )}
      {/* Search results */}
      {loading && <div className="search-loading">Loading...</div>}
      {error && <div className="search-error">{error}</div>}
      {results.length > 0 && (
        <div className="search-results-list">
          {results.map((product) => (
            <div className="search-result-card" key={product._id || product.id} onClick={() => handleCardClick(product)} style={{ cursor: 'pointer' }}>
              <img
                src={product.image?.startsWith('http') ? product.image : `${import.meta.env.VITE_APP_API_URL.replace('/api', '')}${product.image || product.url}`}
                alt={product.name}
                className="search-result-image"
                onError={e => { e.target.onerror = null; e.target.src = '/src/assets/Icons/ImagePlaceholder.png'; }}
              />
              <div className="search-result-info">
                <h3>{product.name}</h3>
                <p>${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {query.trim() && !loading && results.length === 0 && !error && (
        <div className="search-no-results">No products found.</div>
      )}
      <BottomSheetProductFull
        productId={selectedProductId}
        products={allProducts.length > 0 ? allProducts : results}
        open={bottomSheetOpen}
        onClose={handleCloseBottomSheet}
        onAdd={handleAddToCart}
        count={bottomSheetCount}
        setCount={setBottomSheetCount}
      />
      
      <nav className="bottom-navbar">
        <a href="/home" className="nav-icon" aria-label="Home">
          <img src="/Home.png" alt="Home" />
        </a>
        <a href="/search" className="nav-icon" aria-label="Search">
          <img src="/Searchseccion.png" alt="Search"/>
        </a>
        <button onClick={handleAvatarClick} className="nav-icon" aria-label="Avatar">
          <img src="/AvatarIcon.png" alt="Avatar" />
        </button>
      </nav>
    </div>
  );
};

export default Search;
