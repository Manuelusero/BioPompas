import './Categories.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ArrowLeftIcon from '/src/assets/Icons/ArrowLeftIcon.png';

// Cart badge header component
function CategoriesHeaderWithCartBadge() {
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
    <div className="categoriesHeader">
      <Link to="/home" className="categoriesBack">
        <img src={ArrowLeftIcon} alt="Back" className="arrowIcon" />
      </Link>
      <h2 className="categoriesTitle">CATEGORIES</h2>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <img src="/src/assets/Icons/Cart.svg" alt="Carrito" className="categoriesCart" />
        {cartCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-10px',
            right: '-8px',
            background: '#5C7347',
            color: '#fff',
            borderRadius: '50%',
            padding: '2px 6px',
            fontSize: '10px',
            fontWeight: 'bold',
            zIndex: 10,
            boxShadow: '0 2px 8px #0002'
          }}>{cartCount}</span>
        )}
      </div>
    </div>
  );
}

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/api/categories')
      .then(res => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  return (
    <div className="categoriesPage">
      <CategoriesHeaderWithCartBadge />
      <div className="categoriesGrid">
        {categories.map(cat => (
          <Link to={`/category/${encodeURIComponent(cat.name.split(',')[0].trim())}`} className="categoryCard" key={cat._id} style={{ position: 'relative' }}>
            <img src={`http://localhost:5001${cat.image}`} alt={cat.name} />
          </Link>
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

export default Categories;