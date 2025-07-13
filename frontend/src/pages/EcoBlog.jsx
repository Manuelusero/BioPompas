import { useEffect, useState } from "react";
import "./Home.css";

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
      <h1 className="eco-blog-title" style={{ marginTop: 24 }}>
        Eco Blog <span className="eco-blog-sub">(Tips for a sustainable life)</span>
      </h1>
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
