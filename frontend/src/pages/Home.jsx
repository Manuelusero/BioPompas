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
        fetchProducts();
        fetchTopPicks();
        fetchCategories();
        fetchGiftBundles();
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
        </div>
    );
};

export default Home;
