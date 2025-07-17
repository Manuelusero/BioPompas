import { useEffect, useState } from "react";
import "./Home.css";
function EcoBlogHeaderWithCartBadge() {
  const [cartCount, setCartCount] = useState(0);
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
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginTop: 24 }}>
      <h1 className="eco-blog-title">
        Eco Blog <span className="eco-blog-sub">(Tips for a sustainable life)</span>
      </h1>
      <div style={{ position: 'relative', display: 'inline-block', marginLeft: '10px' }}>
        <img src="/src/assets/Icons/Cart.svg" alt="Cart" />
        {cartCount > 0 && (
          <span style={{ position: 'absolute', top: '-10px', right: '-8px', background: '#5C7347', color: '#fff', borderRadius: '50%', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold', zIndex: 10, boxShadow: '0 2px 8px #0002' }}>{cartCount}</span>
        )}
      </div>
    </div>
  );
}

const EcoBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <div className="eco-blog-page">
      <EcoBlogHeaderWithCartBadge />
      <div className="eco-blog-list">
        {blogs.map((blog) => (
          <div className="eco-blog-card" key={blog._id}>
            <img src={`http://localhost:5001${blog.image}`} alt={blog.title} />
            <div className="eco-blog-info">
              <div className="eco-blog-title-card">{blog.title}</div>
              <div className="eco-blog-summary">{blog.summary}</div>
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

export default EcoBlog;
