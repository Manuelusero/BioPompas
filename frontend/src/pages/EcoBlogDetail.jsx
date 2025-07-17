import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./EcoBlogDetail.css";
import ArrowLeftIcon from '/src/assets/Icons/ArrowLeftIcon.png';

const EcoBlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_APP_API_URL}/blogs`)
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data);
        const found = data.find((b) => b.slug === slug);
        setBlog(found);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!blog) return <div style={{ padding: 24 }}>Blog not found.</div>;

  // Filtrar los otros blogs
  const otherBlogs = blogs.filter((b) => b.slug !== slug).slice(0, 2);

  return (
    <div className="ecoBlogDetailPage">
      <div className="ecoBlogDetailHeader">
        <button
          className="ecoBlogDetailBack"
          onClick={() => navigate("/home")}
          title="Volver al Home"
        >
          <span className="ecoBlogDetailArrowIcon"><img src={ArrowLeftIcon} alt="Back" className="arrowIcon" /></span>
        </button>
        <h2 className="ecoBlogDetailTitle">Eco Blog</h2>
        <img
          src="/src/assets/Icons/Cart.svg"
          alt="Carrito"
          className="ecoBlogDetailCart"
        />
      </div>
      <h1 className="eco-blog-title">{blog.title}</h1>
      <div className="eco-blog-content">
        {blog.content.split(/\n\n/).map((block, i) => {
          // Si el bloque comienza con un subtítulo, lo renderiza como <h3>
          const subtitleMatch = block.match(/^(What is the zero-waste movement\?|What is the purpose of zero-waste\?|How do people live a zero-waste lifestyle\?)/);
          if (subtitleMatch) {
            const [subtitle] = subtitleMatch;
            const paragraph = block.replace(subtitle, '').trim();
            return (
              <div key={i}>
                <h3>{subtitle}</h3>
                <p>{paragraph}</p>
              </div>
            );
          }
          // Si no es subtítulo, solo renderiza como párrafo
          return <p key={i}>{block}</p>;
        })}
      </div>
      {/* READ ALSO section */}
      {otherBlogs.length > 0 && (
        <div className="eco-blog-readalso-section">
          <h3 className="eco-blog-readalso-title">READ ALSO</h3>
          <div className="eco-blog-readalso-list">
            {otherBlogs.map((b) => (
              <Link to={`/eco-blog/${b.slug}`} key={b._id} className="eco-blog-readalso-card">
                <img src={`http://localhost:5001${b.image}`} alt={b.title} />
              </Link>
            ))}
          </div>
        </div>
      )}
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

export default EcoBlogDetail;
