import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "./Home.css";
import { Link } from "react-router-dom";
import BottomSheetProductFull from "../components/BottomSheetProductFull";

const Home = () => {
    const [cartCount, setCartCount] = useState(0);
    const [products, setProducts] = useState([]); // Solo productos reales
    const [promotions, setPromotions] = useState([]); // Promociones para el Swiper
    const [topPicks, setTopPicks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [giftBundles, setGiftBundles] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [ecoBottles, setEcoBottles] = useState([]);
    const [ecoSouvenirs, setEcoSouvenirs] = useState([]);
    const [ourStore, setOurStore] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
    const [bottomSheetCount, setBottomSheetCount] = useState(1);
    // El estado del carrito ya no se gestiona aquí, sino en Bag.jsx

    useEffect(() => {
        // Sincronizar el contador del carrito con backend si hay token, si no con localStorage
        const fetchCartCount = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/cart`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    console.log('[DEBUG] Respuesta GET /cart:', response.data);
                    const cartArr = response.data.items || [];
                    if (cartArr.length === 0) {
                        console.warn('[DEBUG] El carrito del backend está vacío para este usuario.');
                    }
                    setCartCount(cartArr.reduce((sum, item) => sum + (item.quantity || item.count || 0), 0));
                } catch (err) {
                    console.error('[DEBUG] Error al obtener el carrito del backend:', err);
                    setCartCount(0);
                }
            } else {
                const storedCart = localStorage.getItem('cart');
                if (storedCart) {
                    const cartArr = JSON.parse(storedCart).filter(item => item._id && item.count > 0);
                    setCartCount(cartArr.reduce((sum, item) => sum + item.count, 0));
                } else {
                    setCartCount(0);
                }
            }
        };
        fetchCartCount();
        window.addEventListener('cartUpdated', fetchCartCount);
        window.addEventListener('storage', fetchCartCount);

        // Obtener productos reales
        fetch(`${import.meta.env.VITE_APP_API_URL}/products`)
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(error => {
                console.error("Error al obtener productos:", error);
                setError("Hubo un error al cargar los productos.");
            });
        // Obtener promociones
        fetch(`${import.meta.env.VITE_APP_API_URL}/promotions`)
            .then(res => res.json())
            .then(data => setPromotions(data))
            .catch(error => {
                console.error("Error al obtener promociones:", error);
            })
            .finally(() => setLoading(false));

        // ...otros fetch (puedes dejar axios o migrar a fetch si lo prefieres)
        const fetchTopPicks = async () => {
            try {
                // Usar el endpoint unificado de productos filtrando por categoría TOPPICKS
                const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/products/category/TOPPICKS`);
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
                // Usar el endpoint unificado de productos filtrando por categoría GIFTBUNDLES
                const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/products/category/GIFTBUNDLES`);
                setGiftBundles(response.data);
            } catch (error) {
                console.error("Error al obtener gift bundles:", error);
            }
        };
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/blogs`);
                setBlogs(response.data);
            } catch (error) {
                console.error("Error al obtener blogs:", error);
            }
        };
        const fetchEcoBottles = async () => {
            try {
                // Usar el endpoint unificado de productos filtrando por categoría ECOBOTTLES
                const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/products/category/ECOBOTTLES`);
                setEcoBottles(response.data);
            } catch (error) {
                console.error("Error al obtener eco bottles:", error);
            }
        };
        const fetchEcoSouvenirs = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/products/category/ECOSOUVENIRS`);
                setEcoSouvenirs(response.data);
            } catch (error) {
                console.error("Error al obtener eco souvenirs:", error);
            }
        };
        const fetchOurStore = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/our-store`);
                setOurStore(response.data);
            } catch (error) {
                console.error("Error al obtener our store:", error);
            }
        };
        fetchTopPicks();
        fetchCategories();
        fetchGiftBundles();
        fetchBlogs();
        fetchEcoBottles();
        fetchEcoSouvenirs();
        fetchOurStore();

        // Cleanup: solo aquí el return
        return () => {
            window.removeEventListener('cartUpdated', fetchCartCount);
            window.removeEventListener('storage', fetchCartCount);
        };
    }, []);

    const handleCardClick = (product) => {
        setSelectedProductId(product._id);
        setBottomSheetOpen(true);
        setBottomSheetCount(1);
    };

    const handleCloseBottomSheet = () => {
        setBottomSheetOpen(false);
        setSelectedProductId(null);
    };

    const handleAddToCart = async (product, count) => {
        const productId = product._id;
        const token = localStorage.getItem('token');
        if (token) {
            // Usuario logueado: sincroniza con backend
            try {
                const resp = await axios.post(
                    `${import.meta.env.VITE_APP_API_URL}/cart`,
                    { productId, quantity: count },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                console.log('[DEBUG] Respuesta POST /cart:', resp.data);
                window.dispatchEvent(new Event('cartUpdated'));
            } catch (err) {
                console.error('[DEBUG] Error al agregar al carrito (POST /cart):', err);
                alert('Error al agregar al carrito');
            }
        } else {
            // No logueado: localStorage
            const storedCart = localStorage.getItem('cart');
            let cartArr = storedCart ? JSON.parse(storedCart) : [];
            cartArr = cartArr.filter(item => item._id && item.count > 0);
            const existingIndex = cartArr.findIndex(item => item._id === productId);
            if (existingIndex !== -1) {
                cartArr[existingIndex].count = (cartArr[existingIndex].count || 1) + count;
            } else {
                cartArr.push({ ...product, count });
            }
            cartArr = cartArr.filter(item => item._id && item.count > 0);
            localStorage.setItem('cart', JSON.stringify(cartArr));
            window.dispatchEvent(new Event('cartUpdated'));
        }
        setBottomSheetOpen(false);
        setSelectedProductId(null);
    };

    return (
        <div className="homePage">
            <div className="logo-container">
                <img src="/LogoSmall.svg" alt="Logo" />
                <Link to="/bag" className="cart-icon-container">
                  <img src="/src/assets/Icons/Cart.svg" alt="Carrito" className="cart-icon" />
                  {cartCount > 0 && (
                    <span className="cart-badge">{cartCount}</span>
                  )}
                </Link>
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
                    {promotions.map((promo) => (
                        <SwiperSlide key={promo._id}>
                          {(() => {
                            // Find the best matching category for this promo
                            let matchedCategory = categories.find(cat => {
                              // Match by name (case-insensitive, partial match)
                              return promo.category && cat.name && promo.category.toLowerCase().includes(cat.name.toLowerCase());
                            });
                            // Fallback: first category if no match
                            const categoryUrl = matchedCategory ? matchedCategory.url : (categories[0] ? categories[0].url : '/categories');
                            return (
                              <Link to={categoryUrl} style={{ textDecoration: 'none' }}>
                                <div className="card">
                                  <img src={promo.image && (promo.image.startsWith('http') ? promo.image : `http://localhost:5001${promo.image}`)} alt={promo.name} />
                                </div>
                              </Link>
                            );
                          })()}
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}

            {/* Sección Top Picks */}
            <section className="top-picks-section">
                <div className="top-picks-header">
                    <h3 className="top-picks-title">TOP PICKS</h3>
                    <span className="see-all-link">
                        <Link to="/top-picks">SEE ALL</Link>
                    </span>
                </div>
                <div className="top-picks-scroll">
                    {topPicks.slice(0, 4).map((product) => (
                        <div className="top-pick-card" key={product._id} onClick={() => handleCardClick(product)}>
                            <img src={`http://localhost:5001${product.image}`} alt={product.name} />
                            <div className="top-pick-info">
                                <div className="top-pick-name">{product.name}</div>
                                <div className="top-pick-price">
                                    <span>€</span>
                                    <span>{Number(product.price).toFixed(2)}</span>
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
                        <Link to="/categories">SEE ALL</Link>
                    </span>
                </div>
                <div className="categories-scroll">
                    {categories.slice(0, 4).map((cat) => (
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
                        <div className="gift-bundle-card" key={bundle._id} onClick={() => handleCardClick(bundle)}>
                            <img src={`http://localhost:5001${bundle.image}`} alt={bundle.name} />
                            <div className="gift-bundle-info">
                                <div className="gift-bundle-name">{bundle.name}</div>
                                <div className="gift-bundle-price">
                                    <span>€</span>
                                    <span>{Number(bundle.price).toFixed(2)}</span>
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
                        <div className="eco-bottle-card" key={bottle._id} onClick={() => handleCardClick(bottle)}>
                            <img src={`http://localhost:5001${bottle.image}`} alt={bottle.name} />
                            <div className="eco-bottle-info">
                                <div className="eco-bottle-name">{bottle.name}</div>
                                <div className="eco-bottle-price">
                                    <span>€</span>
                                    <span>{Number(bottle.price).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            {/* Fin sección Eco Bottles */}

            {/* Sección Eco Souvenirs */}
            <section className="eco-souvenirs-section">
                <div className="eco-souvenirs-header">
                    <h2 className="eco-souvenirs-title">Eco Souvenirs</h2>
                </div>
                {ecoSouvenirs[0] && (
                  <Link to="/contact" className="eco-souvenir-image-container">
                      <img src={`http://localhost:5001${ecoSouvenirs[0].image}`} alt={ecoSouvenirs[0].name} />
                  </Link>
                )}
            </section>
            {/* Fin sección Eco Souvenirs */}

            {/* Sección Our Store */}
            <section className="our-store-section">
                <div className="our-store-header">
                    <h2 className="our-store-title">Our Store</h2>
                </div>
                {ourStore[0] && (
                  <Link to="/our-store" className="our-store-image-container">
                      <img src={`http://localhost:5001${ourStore[0].image}`} alt={ourStore[0].title} />
                  </Link>
                )}
            </section>
            {/* Fin sección Our Store */}

            {/* NavBar inferior */}
            <nav className="bottom-navbar">
                <a href="#top" className="nav-icon" aria-label="Home">
                    <img src="/src/assets/Icons/HomeIcon.png" alt="Home" />
                </a>
                <Link to="/search" className="nav-icon" aria-label="Search">
                    <img src="/src/assets/Icons/SearchIcon.png" alt="Search" />
                </Link>
                <a href="/login" className="nav-icon" aria-label="Avatar">
                    <img src="/src/assets/Icons/AvatarIcon.png" alt="Avatar" />
                </a>
            </nav>

            <BottomSheetProductFull
                productId={selectedProductId}
                products={[...products, ...topPicks, ...giftBundles, ...ecoBottles]}
                open={bottomSheetOpen}
                onClose={handleCloseBottomSheet}
                onAdd={handleAddToCart}
                count={bottomSheetCount}
                setCount={setBottomSheetCount}
            />
        </div>
    );
    
};

export default Home;
