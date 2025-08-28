import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomSheetProductFull from '../components/BottomSheetProductFull';
import "./Search.css";

const Search = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggested, setSuggested] = useState([]);
  const [results, setResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
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
        const newCount = JSON.parse(storedCart).reduce((sum, item) => sum + (item.count || 1), 0);
        setCartCount(newCount);
      } catch {
        setCartCount(0);
      }
    };
    
    // Update on mount
    updateCartCount();
    
    // Listen for cart updates
    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('storage', updateCartCount);
    
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

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
    // Use id or _id depending on what the product has
    const productId = product._id || product.id;
    setSelectedProductId(productId);
    setBottomSheetOpen(true);
    setBottomSheetCount(1);
  };

  const handleCloseBottomSheet = () => {
    setBottomSheetOpen(false);
  };

  const handleAddToCart = (product, count) => {
    // Use id or _id depending on what the product has
    const productId = product._id || product.id;
    console.log('PRODUCTO A AGREGAR:', product);
    console.log('productId enviado:', productId);
    
    const storedCart = localStorage.getItem('cart');
    let cart = storedCart ? JSON.parse(storedCart) : [];
    
    // Normalize the product to have _id for consistency
    const normalizedProduct = {
      ...product,
      _id: productId,
      id: productId // Keep both for compatibility
    };
    
    const existingIndex = cart.findIndex(item => {
      const itemId = item._id || item.id;
      return itemId === productId;
    });
    
    let newCart;
    if (existingIndex !== -1) {
      newCart = cart.map((item, idx) =>
        idx === existingIndex ? { ...item, count: item.count + count } : item
      );
    } else {
      newCart = [...cart, { ...normalizedProduct, count }];
    }
    
    localStorage.setItem('cart', JSON.stringify(newCart));
    console.log('Cart updated:', newCart);
    
    // Dispatch multiple events and wait a bit
    window.dispatchEvent(new Event('cartUpdated'));
    window.dispatchEvent(new Event('storage'));
    
    // Force update local state
    const newCount = newCart.reduce((sum, item) => sum + (item.count || 1), 0);
    setCartCount(newCount);
    
    setBottomSheetOpen(false);
  };

  const clearSearch = () => {
    setQuery("");
  };

  const handleCartClick = () => {
    navigate('/bag');
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
            src="/src/assets/Icons/Cart.svg" 
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
