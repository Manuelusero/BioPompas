import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./GiftBundlesPage.css";
import axios from "axios";

const GiftBundles = () => {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/gift-bundles")
      .then((res) => {
        setBundles(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <div className="giftBundlesPage">
      <div className="giftBundlesHeader">
        <Link to="/home" className="giftBundlesBack">
          <span className="giftBundlesArrowIcon">&larr;</span>
        </Link>
        <h2 className="giftBundlesTitle">GIFT BUNDLES</h2>
        <Link to="/cart" className="giftBundlesCartIcon" aria-label="Cart">
          <img src="/src/assets/Icons/Cart.svg" alt="Cart" />
        </Link>
      </div>
      <div className="giftBundlesGrid">
        {bundles.map((bundle) => (
          <div className="giftBundleCard" key={bundle._id}>
            <img
              src={`http://localhost:5001${bundle.image}`}
              alt={bundle.name}
            />
            <div className="giftBundleName">{bundle.name}</div>
            <div className="giftBundlePrice">
              {bundle.price.toLocaleString("es-ES", {
                style: "currency",
                currency: "EUR",
              })}
            </div>
          </div>
        ))}
      </div>
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