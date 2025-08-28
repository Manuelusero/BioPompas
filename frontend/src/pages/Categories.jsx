import './Categories.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCart } from '../api/CartContext';
import ArrowLeftIcon from '/src/assets/Icons/ArrowLeftIcon.png';


// Cart badge header component
function CategoriesHeaderWithCartBadge() {
  const { cartCount } = useCart();
  
  return (
    <div className="categoriesHeader">
      <Link to="/home" className="categoriesBack">
        <img src={ArrowLeftIcon} alt="Back" className="arrowIcon" />
      </Link>
      <h2 className="categoriesTitle">CATEGORIES</h2>
      <Link to="/bag" className="categoriesCartIcon">
        <img src="/src/assets/Icons/Cart.svg" alt="Carrito" className="categoriesCartIconImg" />
        {cartCount > 0 && (
          <span className="categoriesCartBadge">{cartCount}</span>
        )}
      </Link>
    </div>
  );
}

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_APP_API_URL}/categories`)
      .then(res => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  // Scroll automático al top cuando se carga la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="categoriesPage">
      <CategoriesHeaderWithCartBadge />
      <div className="categoriesGrid">
        {categories.map(cat => (
          <Link to={`/category/${encodeURIComponent(cat.name.split(',')[0].trim())}`} className="categoryCard" key={cat._id} style={{ position: 'relative' }}>
            <img src={`${import.meta.env.VITE_APP_API_URL.replace('/api', '')}${cat.image}`} alt={cat.name} />
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