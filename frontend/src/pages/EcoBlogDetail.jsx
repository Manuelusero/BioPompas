import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Home.css";

const EcoBlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blogs`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((b) => b.slug === slug);
        setBlog(found);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!blog) return <div style={{ padding: 24 }}>Blog not found.</div>;

  return (
    <div className="eco-blog-detail-page">
      <h1 className="eco-blog-title" style={{ marginTop: 24 }}>{blog.title}</h1>
      <img src={`http://localhost:5001${blog.image}`} alt={blog.title} style={{ width: "100%", maxWidth: 500, borderRadius: 16, margin: "24px 0" }} />
      <div className="eco-blog-detail-summary">{blog.summary}</div>
      {/* Aquí puedes expandir con más contenido si lo agregas al modelo */}
    </div>
  );
};

export default EcoBlogDetail;
