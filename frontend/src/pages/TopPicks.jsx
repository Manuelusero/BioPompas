import "./TopPicks.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ArrowLeftIcon from '/src/assets/Icons/ArrowLeftIcon.png';
import BottomSheetProductFull from "../components/BottomSheetProductFull";

const TopPicks = () => {
  const [topPicks, setTopPicks] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [bottomSheetCount, setBottomSheetCount] = useState(1);
  // Eliminar estado local de cart, solo usar localStorage

  useEffect(() => {
    const syncCart = () => {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const cartArr = JSON.parse(storedCart).filter(item => item._id && item.count > 0);
        setCartCount(cartArr.reduce((sum, item) => sum + item.count, 0));
      } else {
        setCartCount(0);
      }
    };
    syncCart();
    window.addEventListener('cartUpdated', syncCart);
    window.addEventListener('storage', syncCart);
    return () => {
      window.removeEventListener('cartUpdated', syncCart);
      window.removeEventListener('storage', syncCart);
    };
  }, []);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_APP_API_URL}/products/category/TOPPICKS`)
      .then(res => setTopPicks(res.data))
      .catch(() => setTopPicks([]));
  }, []);

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
    <div className="toppicks-page">
      <div className="toppicks-header">
        <Link to="/home" className="toppicks-back"><img src={ArrowLeftIcon} alt="Back" className="arrow-icon" /></Link>
        <h2 className="toppicks-title">Top Picks</h2>
        <div className="toppicks-cart-container">
          <img src="/src/assets/Icons/Cart.svg" alt="Carrito" className="toppicks-cart" />
          {cartCount > 0 && (
            <span className="cart-badge-topPick">{cartCount}</span>
          )}
        </div>
      </div>
      <div className="toppicks-list">
        {topPicks.map((product) => (
          <div className="toppick-card" key={product._id} onClick={() => handleCardClick(product)}>
            <img src={`http://localhost:5001${product.image}`} alt={product.name} />
            <div className="toppick-name">{product.name}</div>
            <div className="toppick-price">€{Number(product.price).toFixed(2)}</div>
          </div>
        ))}
      </div>
      <BottomSheetProductFull
        productId={selectedProductId}
        products={topPicks}
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

export default TopPicks;