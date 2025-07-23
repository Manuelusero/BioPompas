
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./GiftBundles.css";
import axios from "axios";
import ArrowLeftIcon from '/src/assets/Icons/ArrowLeftIcon.png';
import BottomSheetProductFull from "../components/BottomSheetProductFull";

function GiftBundlesHeaderWithCartBadge() {
  const [cartCount, setCartCount] = useState(0);
  useEffect(() => {
    const updateCartCount = () => {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const cartArr = JSON.parse(storedCart);
        setCartCount(cartArr.reduce((sum, item) => sum + item.count, 0));
      } else {
        setCartCount(0);
      }
    };
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);
  return (
    <div className="giftBundlesHeader">
      <Link to="/home" className="giftBundlesBack">
        <span className="giftBundlesArrowIcon"><img src={ArrowLeftIcon} alt="Back" className="arrowIcon" /></span>
      </Link>
      <h2 className="giftBundlesTitle">GIFT BUNDLES</h2>
      <div className="giftBundlesCartIcon">
        <img src="/src/assets/Icons/Cart.svg" alt="Cart" className="giftBundlesCartIconImg" />
        {cartCount > 0 && (
          <span className="giftBundlesCartBadge">{cartCount}</span>
        )}
      </div>
    </div>
  );
}

GiftBundlesHeaderWithCartBadge.propTypes = {};

const GiftBundles = () => {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [bottomSheetCount, setBottomSheetCount] = useState(1);
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_APP_API_URL}/products/category/GIFTBUNDLES`)
      .then((res) => {
        setBundles(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  const handleCardClick = (product) => {
    setSelectedProductId(product._id || product.id);
    setBottomSheetOpen(true);
    setBottomSheetCount(1);
  };

  const handleCloseBottomSheet = () => {
    setBottomSheetOpen(false);
  };

  const handleAddToCart = (product, count) => {
    const productId = product._id || product.id;
    const existingIndex = cart.findIndex(item => (item._id || item.id) === productId);
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
    <div className="toppicks-page">
      <GiftBundlesHeaderWithCartBadge />
      <div className="toppicks-list">
        {bundles.map((bundle) => (
          <div className="toppick-card" key={bundle._id} onClick={() => handleCardClick(bundle)}>
            <img
              src={`http://localhost:5001${bundle.image}`}
              alt={bundle.name}
            />
            <div className="toppick-name">{bundle.name}</div>
            <div className="toppick-price">
              <span>€</span>{Number(bundle.price).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      <BottomSheetProductFull
        productId={selectedProductId}
        products={bundles}
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

export default GiftBundles;