import { useState, useEffect } from "react";
import axios from "axios";
import BottomSheetProductFull from '../components/BottomSheetProductFull';
import "./Search.css";

const Search = () => {
  const [query, setQuery] = useState("");
  const [suggested, setSuggested] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cartCount, setCartCount] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    if (!storedCart) return 0;
    try {
      return JSON.parse(storedCart).reduce((sum, item) => sum + (item.count || 1), 0);
    } catch {
      return 0;
    }
  });
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [bottomSheetCount, setBottomSheetCount] = useState(1);

  useEffect(() => {
    const updateCartCount = () => {
      const storedCart = localStorage.getItem('cart');
      if (!storedCart) return setCartCount(0);
      try {
        setCartCount(JSON.parse(storedCart).reduce((sum, item) => sum + (item.count || 1), 0));
      } catch {
        setCartCount(0);
      }
    };
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  // Get product suggestions on mount
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_APP_API_URL}/products?isFeatured=true`)
      .then(res => setSuggested(res.data.slice(0, 4)))
      .catch(() => setSuggested([]));
  }, []);

  // Search products as user types
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setError("");
      return;
    }
    setLoading(true);
    setError("");
    axios.get(`${import.meta.env.VITE_APP_API_URL}/products`)
      .then(res => {
        const allProducts = res.data;
        const q = query.trim().toLowerCase();
        const filtered = allProducts.filter(prod =>
          prod.name?.toLowerCase().includes(q) ||
          prod.description?.toLowerCase().includes(q) ||
          prod.category?.toLowerCase().includes(q)
        );
        setResults(filtered);
      })
      .catch(() => setError("Error loading products"))
      .finally(() => setLoading(false));
  }, [query]);

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
    const storedCart = localStorage.getItem('cart');
    let cart = storedCart ? JSON.parse(storedCart) : [];
    const existingIndex = cart.findIndex(item => (item.id || item._id) === productId);
    let newCart;
    if (existingIndex !== -1) {
      newCart = cart.map((item, idx) =>
        idx === existingIndex ? { ...item, count: item.count + count } : item
      );
    } else {
      newCart = [...cart, { ...product, count }];
    }
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartUpdated'));
    setBottomSheetOpen(false);
  };

  return (
    <div className="searchPage">
      <div className="searchHeaderRow">
        <h1 className="searchTitle">Search products</h1>
        <div className="search-cart-icon-container">
          <img src="/src/assets/Icons/Cart.svg" alt="Cart" className="searchCartIcon" />
          {cartCount > 0 && (
            <span className="cart-badge-search">{cartCount}</span>
          )}
        </div>
      </div>
      <input
        type="text"
        placeholder="Search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="searchInput"
      />
      {/* Product suggestions */}
      {suggested.length > 0 && !query.trim() && (
        <div style={{ marginBottom: 24 }}>
          <div className="suggestionLabel">Suggestions:</div>
          <div className="suggestionPills">
            {suggested.map((prod, idx) => (
              <span
                key={`${prod._id || prod.id}-${idx}`}
                className="suggestionPill"
                style={{ cursor: 'pointer' }}
                onClick={() => setQuery(prod.name)}
              >
                {prod.name}
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
          {results.map((product, idx) => (
            <div className="search-result-card" key={`${product.id || product._id}-${idx}`} onClick={() => handleCardClick(product)} style={{ cursor: 'pointer' }}>
              <img
                src={product.image?.startsWith('http') ? product.image : `http://localhost:5001${product.image || product.url}`}
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
        products={results}
        open={bottomSheetOpen}
        onClose={handleCloseBottomSheet}
        onAdd={handleAddToCart}
        count={bottomSheetCount}
        setCount={setBottomSheetCount}
      />
      <nav className="bottom-navbar">
        <a href="/home" className="nav-icon" aria-label="Home">
          <img src="/src/assets/Icons/Home.png" alt="Home" />
        </a>
        <a href="/search" className="nav-icon" aria-label="Search">
          <img src="/src/assets/Icons/Searchseccion.png" alt="Search" />
        </a>
        <a href="/login" className="nav-icon" aria-label="Avatar">
          <img src="/src/assets/Icons/AvatarIcon.png" alt="Avatar" />
        </a>
      </nav>
    </div>
  );
};

export default Search;
