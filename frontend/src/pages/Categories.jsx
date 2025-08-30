import './Categories.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../api/CartContext';



// Cart badge header component
function CategoriesHeaderWithCartBadge() {
  const { cartCount } = useCart();
  
  return (
    <div className="categoriesHeader">
      <Link to="/home" className="categoriesBack">
        <img src="/ArrowLeftIcon" alt="Back" className="arrowIcon" />
      </Link>
      <h2 className="categoriesTitle">CATEGORIES</h2>
      <Link to="/bag" className="categoriesCartIcon">
        <img src="/Cart.svg" alt="Carrito" className="categoriesCartIconImg" />
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
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/categories`);
        console.log('Categories response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }
        
        const data = await response.json();
        console.log('Categories data received:', data);
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error al obtener categories:", error);
        setCategories([]);
      }
    };

    fetchCategories();
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
          <img src="/HomeIcon.png" alt="Home" />
        </a>
        <a href="/search" className="nav-icon" aria-label="Search">
          <img src="/SearchIcon.png" alt="Search" />
        </a>
        <a href="/login" className="nav-icon" aria-label="Avatar">
          <img src="/AvatarIcon.png" alt="Avatar" />
        </a>
      </nav>
    </div>
  );
};

export default Categories;