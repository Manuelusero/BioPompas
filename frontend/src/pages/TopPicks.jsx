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
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const cartArr = JSON.parse(storedCart);
      setCartCount(cartArr.reduce((sum, item) => sum + item.count, 0));
    } else {
      setCartCount(0);
    }
    const syncCart = () => {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const cartArr = JSON.parse(storedCart);
        setCartCount(cartArr.reduce((sum, item) => sum + item.count, 0));
      } else {
        setCartCount(0);
      }
    };
    window.addEventListener('storage', syncCart);
    return () => window.removeEventListener('storage', syncCart);
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5001/api/top-picks")
      .then(res => setTopPicks(res.data))
      .catch(() => setTopPicks([]));
  }, []);

  const handleCardClick = (product) => {
    setSelectedProductId(product.id || product._id);
    setBottomSheetOpen(true);
    setBottomSheetCount(1);
  };

  const handleCloseBottomSheet = () => {
    setBottomSheetOpen(false);
  };

  const handleAddToCart = (product, count) => {
    // Busca si el producto ya está en el carrito
    const productId = product.id || product._id;
    const existingIndex = cart.findIndex(item => (item.id || item._id) === productId);
    let newCart;
    if (existingIndex !== -1) {
      // Si existe, suma la cantidad
      newCart = cart.map((item, idx) =>
        idx === existingIndex ? { ...item, count: item.count + count } : item
      );
    } else {
      // Si no existe, lo agrega
      newCart = [...cart, { ...product, count }];
    }
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    setCartCount(newCart.reduce((sum, item) => sum + item.count, 0));
    setBottomSheetOpen(false);
  };

  return (
    <div className="toppicks-page">
      <div className="toppicks-header">
        <Link to="/home" className="toppicks-back"><img src={ArrowLeftIcon} alt="Back" className="arrow-icon" /></Link>
        <h2 className="toppicks-title">Top Picks</h2>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img src="/src/assets/Icons/Cart.svg" alt="Carrito" className="toppicks-cart" />
          {cartCount > 0 && (
            <span style={{ position: 'absolute', top: '-10px', right: '-8px', background: '#5C7347', color: '#fff', borderRadius: '50%', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold', zIndex: 10, boxShadow: '0 2px 8px #0002' }}>{cartCount}</span>
          )}
        </div>
      </div>
      <div className="toppicks-list">
        {topPicks.map((product) => (
          <div className="toppick-card" key={product.id} onClick={() => handleCardClick(product)}>
            <img src={`http://localhost:5001${product.image}`} alt={product.name} />
            <div className="toppick-name">{product.name}</div>
            <div className="toppick-price">{product.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</div>
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