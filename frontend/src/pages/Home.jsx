import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "./Home.css";
import { Link } from "react-router-dom";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [topPicks, setTopPicks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [giftBundles, setGiftBundles] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [ecoBottles, setEcoBottles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_APP_API_URL}/products?isFeatured=true`
                );
                setProducts(response.data.slice(0, 4)); // Solo 4 productos
            } catch (error) {
                console.error("Error al obtener productos:", error);
                setError("Hubo un error al cargar los productos.");
            } finally {
                setLoading(false);
            }
        };
        const fetchTopPicks = async () => {
            try {
                const response = await axios.get("http://localhost:5001/api/top-picks");
                setTopPicks(response.data);
            } catch (error) {
                console.error("Error al obtener top picks:", error);
            }
        };
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:5001/api/categories");
                setCategories(response.data);
            } catch (error) {
                console.error("Error al obtener categories:", error);
            }
        };
        const fetchGiftBundles = async () => {
            try {
                const response = await axios.get("http://localhost:5001/api/gift-bundles");
                setGiftBundles(response.data);
            } catch (error) {
                console.error("Error al obtener gift bundles:", error);
            }
        };
        const fetchBlogs = async () => {
            try {
                const response = await axios.get("http://localhost:5001/api/blogs");
                setBlogs(response.data);
            } catch (error) {
                console.error("Error al obtener blogs:", error);
            }
        };
        const fetchEcoBottles = async () => {
            try {
                const response = await axios.get("http://localhost:5001/api/eco-bottles");
                setEcoBottles(response.data);
            } catch (error) {
                console.error("Error al obtener eco bottles:", error);
            }
        };
        fetchProducts();
        fetchTopPicks();
        fetchCategories();
        fetchGiftBundles();
        fetchBlogs();
        fetchEcoBottles();
    }, []);

    return (
        <div>
            <div className="logo-container">
                <img src="/LogoSmall.svg" alt="Logo" />
                <img src="/src/assets/Icons/Cart.svg" alt="Carrito" className="cart-icon" />
            </div>
            <h2 className="titulo-marca">DEALS OF THE WEEK</h2>

            {loading ? (
                <p>Cargando productos...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <Swiper
                    modules={[Autoplay]}
                    autoplay={{ delay: 3000, disableOnInteraction: false }} // Avanza cada 3s
                    spaceBetween={20}
                    slidesPerView={1}
                    loop // Hace que los productos vuelvan a empezar en bucle
                >
                    {products.map((product) => (
                        <SwiperSlide key={product._id || product.id}>
                            <div className="card">
                                <img src={`http://localhost:5001${product.image}`} alt={product.name} />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}

            {/* Sección Top Picks */}
            <section className="top-picks-section">
                <div className="top-picks-header">
                    <h3 className="top-picks-title">TOP PICKS</h3>
                    <span className="see-all-link">
                        <a href="/top-picks">SEE ALL</a>
                    </span>
                </div>
                <div className="top-picks-scroll">
                    {topPicks.map((product) => (
                        <div className="top-pick-card" key={product._id}>
                            <img src={`http://localhost:5001${product.image}`} alt={product.name} />
                            <div className="top-pick-info">
                                <div className="top-pick-name">{product.name}</div>
                                <div className="top-pick-price">
                                    {product.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            {/* Fin sección Top Picks */}

            {/* Sección Categories */}
            <section className="categories-section">
                <div className="categories-header">
                    <h3 className="categories-title">CATEGORIES</h3>
                    <span className="see-all-link">
                        <a href="/categories">SEE ALL</a>
                    </span>
                </div>
                <div className="categories-scroll">
                    {categories.map((cat) => (
                        <a href={cat.url} className="category-card" key={cat._id}>
                            <img src={`http://localhost:5001${cat.image}`} alt={cat.name} />
                        </a>
                    ))}
                </div>
            </section>
            {/* Fin sección Categories */}

            {/* Sección Gift Bundles */}
            <section className="gift-bundles-section">
                <div className="gift-bundles-header">
                    <h2 className="gift-bundles-title">Gift Bundles</h2>
                    <Link to="/gift-bundles" className="see-all-link">SEE ALL</Link>
                </div>
                <div className="gift-bundles-scroll">
                    {giftBundles.map((bundle) => (
                        <div className="gift-bundle-card" key={bundle._id}>
                            <img src={`http://localhost:5001${bundle.image}`} alt={bundle.name} />
                            <div className="gift-bundle-info">
                                <div className="gift-bundle-name">{bundle.name}</div>
                                <div className="gift-bundle-price">
                                    {bundle.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            {/* Fin sección Gift Bundles */}

            {/* Sección Eco Blog */}
            <section className="eco-blog-section">
                <div className="eco-blog-header">
                    <h2 className="eco-blog-title">Eco Blog <span className="eco-blog-sub">(Tips for a sustainable life)</span></h2>
                </div>
                <div className="eco-blog-scroll">
                    {blogs.map((blog) => (
                        <Link to={`/eco-blog/${blog.slug}`} className="eco-blog-card" key={blog._id}>
                            <img src={`http://localhost:5001${blog.image}`} alt={blog.title} />
                            <div className="eco-blog-info">
                                <div className="eco-blog-title-card">{blog.title}</div>
                                <div className="eco-blog-summary">{blog.summary}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
            {/* Fin sección Eco Blog */}

            {/* Sección Eco Bottles */}
            <section className="eco-bottles-section">
                <div className="eco-bottles-header">
                    <h2 className="eco-bottles-title">Eco Bottles</h2>
                </div>
                <div className="eco-bottles-scroll">
                    {ecoBottles.map((bottle) => (
                        <div className="eco-bottle-card" key={bottle._id}>
                            <img src={`http://localhost:5001${bottle.image}`} alt={bottle.name} />
                            <div className="eco-bottle-info">
                                <div className="eco-bottle-name">{bottle.name}</div>
                                <div className="eco-bottle-price">
                                    {bottle.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            {/* Fin sección Eco Bottles */}
        </div>
    );
};

export default Home;
