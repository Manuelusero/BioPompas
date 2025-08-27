
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./GiftBundles.css";
import axios from "axios";
import { useCart } from "../api/CartContext";
import ArrowLeftIcon from '/src/assets/Icons/ArrowLeftIcon.png';
import BottomSheetProductFull from "../components/BottomSheetProductFull";

function GiftBundlesHeaderWithCartBadge() {
  const { cartCount } = useCart();
  
  return (
    <div className="giftBundlesHeader">
      <Link to="/home" className="giftBundlesBack">
        <span className="giftBundlesArrowIcon"><img src={ArrowLeftIcon} alt="Back" className="arrowIcon" /></span>
      </Link>
      <h2 className="giftBundlesTitle">GIFT BUNDLES</h2>
      <Link to="/bag" className="giftBundlesCartIcon">
        <img src="/src/assets/Icons/Cart.svg" alt="Cart" className="giftBundlesCartIconImg" />
        {cartCount > 0 && (
          <span className="giftBundlesCartBadge">{cartCount}</span>
        )}
      </Link>
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
  const { addToCart } = useCart();

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