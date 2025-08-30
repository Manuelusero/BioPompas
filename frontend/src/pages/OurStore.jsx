import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import "./OurStore.css";
import { useCart } from "../api/CartContext";

function OurStoreHeaderWithCartBadge({ navigate }) {
  const { cartCount } = useCart();
  
  return (
    <div className="ourStoreHeader">
      <button className="ourStoreBack" onClick={() => navigate("/home")}> 
        <span className="ourStoreArrowIcon"><img src="/ArrowLeftIcon.png"alt="Back" className="arrowIcon" /></span>
      </button>
      <h2 className="ourStoreTitle">OUR STORE</h2>
      <div className="ourStoreCartIcon">
        <img src="/Cart.svg" alt="Cart" />
        {cartCount > 0 && (
          <span className="ourStoreCartBadge">{cartCount}</span>
        )}
      </div>
    </div>
  );
}

OurStoreHeaderWithCartBadge.propTypes = {
  navigate: PropTypes.func.isRequired,
};

const OurStore = () => {
  const [ourStore, setOurStore] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${import.meta.env.VITE_APP_API_URL}/our-store`)
      .then((res) => res.json())
      .then((data) => setOurStore(data))
      .catch(() => setOurStore([]));
  }, []);

  return (
    <div className="ourStorePage">
      <OurStoreHeaderWithCartBadge navigate={navigate} />
      <div className="ourStoreImageContainer">
        {ourStore[0] && (
          <img
            src={`${import.meta.env.VITE_APP_API_URL.replace('/api', '')}${ourStore[0].image}`}
            alt={ourStore[0].title}
            className="ourStoreImage"
          />
        )}
      </div>
      <div className="ourStoreText">
        <h3 className="ourStoreSubtitle">About us</h3>
        <p className="ourStoreParagraph">
          We are a small team based in Spain. We founded the Store in 2021 with
          the purpose of bringing affordable eco-options to the market.
        </p>
        <p className="ourStoreParagraph">
          When making the switch to eco products, we were shocked at the prices
          for sustainable products. We wanted to therefore create a shop that
          sourced the best eco products we could find that were affordable and
          minimalistic.
        </p>
        <p className="ourStoreParagraph">
          Our mission is to create a minimalistic collection of eco-products that don&apos;t push consumerism through green washing but instead host a
          collection of bare essential eco products that are fairly priced for
          consumers.
        </p>
      </div>
      <div className="ourStoreIcons">
        <img src="/FullIcons.png" alt="Eco Icons" className="ourStoreFullIcons" />
      </div>
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

export default OurStore;
