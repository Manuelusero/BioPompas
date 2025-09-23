import "./TopPicks.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../api/CartContext";
import BottomSheetProductFull from "../components/BottomSheetProductFull";
import LazyImage from "../components/LazyImage";
import { getImageUrl } from '../utils/api.js';

const TopPicks = () => {
  const [topPicks, setTopPicks] = useState([]);
  const { cartCount, addToCart } = useCart();
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [bottomSheetCount, setBottomSheetCount] = useState(1);

  useEffect(() => {
    // Ya no necesitamos manejar el contador aquí, el CartContext lo hace automáticamente
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

  const handleAddToCart = async (product, count) => {
    try {
      await addToCart(product, count);
      setBottomSheetOpen(false);
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Fallback: usar localStorage si falla el CartContext
      const productId = product._id;
      const storedCart = localStorage.getItem('cart');
      let cartArr = storedCart ? JSON.parse(storedCart) : [];
      cartArr = cartArr.filter(item => item._id && item.count > 0);
      const existingIndex = cartArr.findIndex(item => item._id === productId);
      if (existingIndex !== -1) {
        cartArr[existingIndex].count = (cartArr[existingIndex].count || 1) + count;
      } else {
        cartArr.push({ ...product, count });
      }
      cartArr = cartArr.filter(item => item._id && item.count > 0);
      localStorage.setItem('cart', JSON.stringify(cartArr));
      window.dispatchEvent(new Event('cartUpdated'));
      setBottomSheetOpen(false);
    }
  };

  return (
    <div className="toppicks-page">
      <div className="toppicks-header">
        <Link to="/home" className="toppicks-back">
          <img src="/ArrowLeftIcon.png" alt="Back" className="arrow-icon" />
        </Link>
        <h2 className="toppicks-title">Top Picks</h2>
        <div className="toppicks-cart-container">
          <img src="/Cart.svg" alt="Carrito" className="toppicks-cart" />
          {cartCount > 0 && (
            <span className="cart-badge-topPick">{cartCount}</span>
          )}
        </div>
      </div>
      <div className="toppicks-list">
        {topPicks.map((product) => (
          <div className="toppick-card" key={product._id} onClick={() => handleCardClick(product)}>
            <LazyImage 
              src={getImageUrl(product.image)} 
              alt={product.name}
              skeletonClassName="skeleton-card"
            />
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
          <img src="/HomeIcon.png" alt="Home" />
        </a>
        <a href="/search" className="nav-icon" aria-label="Search">
          <img src="/SearchIcon.png" alt="Search" />
        </a>
        <a href="/login" className="nav-icon" aria-label="Avatar">
          <img src="/AvatarIcon.png"  alt="Avatar" />
        </a>
      </nav>
    </div>
  );
};

export default TopPicks;