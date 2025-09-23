import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../api/CartContext";
import BottomSheetProductFull from "../components/BottomSheetProductFull";
// NUEVO: Importar componente LazyImage
import LazyImage from "../components/LazyImage";
import { getImageUrl, getApiUrl } from '../utils/api.js';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const { cartCount, addToCart } = useCart();
    // Usar verificación directa de localStorage temporalmente
    const isLoggedIn = !!localStorage.getItem('token');
    const [products, setProducts] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [topPicks, setTopPicks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [giftBundles, setGiftBundles] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [ecoBottles, setEcoBottles] = useState([]);
    const [ecoSouvenirs, setEcoSouvenirs] = useState([]);
    const [ourStore, setOurStore] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error] = useState("");
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
    const [bottomSheetCount, setBottomSheetCount] = useState(1);

    useEffect(() => {
        // Obtener productos reales
        fetch(`${getApiUrl()}/products`)
            .then(res => res.json())
            .then(data => setProducts(Array.isArray(data) ? data : []))
            .catch(() => setProducts([]));
        // Obtener promociones
        fetch(`${getApiUrl()}/promotions`)
            .then(res => res.json())
            .then (data => setPromotions(Array.isArray(data) ? data : []))
            .catch(() => setPromotions([]));
        // Otros fetchs
        fetch(`${getApiUrl()}/products/category/TOPPICKS`).then(res => res.json()).then(data => setTopPicks(Array.isArray(data) ? data : [])).catch(() => setTopPicks([]));
        fetch(`${getApiUrl()}/categories`).then(res => res.json()).then(data => setCategories(Array.isArray(data) ? data : [])).catch(() => setCategories([]));
        fetch(`${getApiUrl()}/products/category/GIFTBUNDLES`).then(res => res.json()).then(data => setGiftBundles(Array.isArray(data) ? data : [])).catch(() => setGiftBundles([]));
        fetch(`${getApiUrl()}/blogs`).then(res => res.json()).then(data => setBlogs(Array.isArray(data) ? data : [])).catch(() => setBlogs([]));
        fetch(`${getApiUrl()}/products/category/ECOBOTTLES`).then(res => res.json()).then(data => setEcoBottles(Array.isArray(data) ? data : [])).catch(() => setEcoBottles([]));
        fetch(`${getApiUrl()}/products/category/ECOSOUVENIRS`).then(res => res.json()).then(data => setEcoSouvenirs(Array.isArray(data) ? data : [])).catch(() => setEcoSouvenirs([]));
        fetch(`${getApiUrl()}/our-store`).then(res => res.json()).then(data => setOurStore(Array.isArray(data) ? data : [])).catch(() => setOurStore([]));
        setLoading(false);
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
        console.log('Add to bag click', product, count);
        try {
            await addToCart(product, count);
            setBottomSheetOpen(false);
            setSelectedProductId(null);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const handleAvatarClick = () => {
        if (isLoggedIn) {
            navigate('/profile');
        } else {
            alert('Debes iniciar sesión para acceder a tu perfil.');
            navigate('/login', { state: { from: 'profile' } });
        }
    };

    if (loading) {
        return (
            <div className="homePage">
                <div className="logo-container">
                    <img src="/LogoSmall.svg" alt="Logo" />
                    <Link to="/bag" className="cart-icon-container">
                        <img src="/Cart.svg" alt="Carrito" className="cart-icon" />
                        {cartCount > 0 && (
                            <span className="cart-badge">{cartCount}</span>
                        )}
                    </Link>
                </div>
                <h2 className="titulo-marca">CARGANDO...</h2>
                <p>Cargando productos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="homePage">
                <div className="logo-container">
                    <img src="/LogoSmall.svg" alt="Logo" />
                </div>
                <h2 className="titulo-marca">ERROR</h2>
                <p>{error}</p>
                <p>API URL: {getApiUrl()}</p>
            </div>
        );
    }

    // Filtrar Bamboo ToothBrush y completar con otros productos si faltan
    const filteredTopPicks = topPicks.filter(p => p.name !== 'Bamboo ToothBrush');
    let topPicksToShow = [...filteredTopPicks];
    if (topPicksToShow.length < 4) {
      const usedIds = new Set(topPicksToShow.map(p => p._id || p.id));
      const extra = products.filter(p => !usedIds.has(p._id || p.id)).slice(0, 4 - topPicksToShow.length);
      topPicksToShow = [...topPicksToShow, ...extra];
    }

    return (
        <div className="homePage">
            <div className="logo-container">
                <img src="/LogoSmall.svg" alt="Logo" />
                <Link to="/bag" className="cart-icon-container">
                    <img src="/Cart.svg" alt="Carrito" className="cart-icon" />
                    {cartCount > 0 && (
                        <span className="cart-badge">{cartCount}</span>
                    )}
                </Link>
            </div>

            {/* Deals Of The Week - MODIFICADO: Usar LazyImage */}
            <section className="deals-section">
              <div className="deals-header">
                <h2 className="deals-title">Deals Of The Week</h2>
              </div>
              <Swiper modules={[Autoplay]} autoplay={{ delay: 3000, disableOnInteraction: false }} spaceBetween={20} slidesPerView={1} loop>
                  {promotions.map((promo) => (
                      <SwiperSlide key={promo._id}>
                          <Link to={"/categories"} style={{ textDecoration: 'none' }}>
                              <div className="card">
                                  {/* MODIFICADO: Reemplazar img con LazyImage */}
                                  <LazyImage 
                                    src={getImageUrl(promo.image)} 
                                    alt={promo.name}
                                    skeletonClassName="skeleton-banner"
                                  />
                              </div>
                          </Link>
                      </SwiperSlide>
                  ))}
              </Swiper>
            </section>

            {/* Top Picks - MODIFICADO: Usar LazyImage */}
            <section className="top-picks-section">
                <div className="top-picks-header">
                    <h2 className="top-picks-title">Top Picks</h2>
                    <div className="see-all-link">
                        <Link to="/top-picks">See All</Link>
                    </div>
                </div>
                <div className="top-picks-scroll">
                    {topPicksToShow.filter(product => product.name !== 'Bamboo Toothbrush').map((product) => (
                        <div className="top-pick-card" key={product._id} onClick={() => handleCardClick(product)}>
                            {/* MODIFICADO: Reemplazar img con LazyImage */}
                            <LazyImage 
                              src={getImageUrl(product.image)} 
                              alt={product.name}
                              skeletonClassName="skeleton-card"
                            />
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

            {/* Categories - MODIFICADO: Usar LazyImage */}
            <section className="categories-section">
                <div className="categories-header">
                    <h3 className="categories-title">Categories</h3>
                    <span className="see-all-link">
                        <Link to="/categories">See All</Link>
                    </span>
                </div>
                <div className="categories-scroll">
                    {categories.slice(0, 4).map((cat) => (
                        <a href={cat.url} className="category-card" key={cat._id}>
                            {/* MODIFICADO: Reemplazar img con LazyImage */}
                            <LazyImage 
                              src={getImageUrl(cat.image)} 
                              alt={cat.name}
                              skeletonClassName="skeleton-category"
                            />
                        </a>
                    ))}
                </div>
            </section>

            {/* Gift Bundles - MODIFICADO: Usar LazyImage */}
            <section className="gift-bundles-section">
                <div className="gift-bundles-header">
                    <h2 className="gift-bundles-title">Gift Bundles</h2>
                    <Link to="/gift-bundles" className="see-all-link">See All</Link>
                </div>
                <div className="gift-bundles-scroll">
                    {giftBundles.map((bundle) => (
                        <div className="gift-bundle-card" key={bundle._id} onClick={() => handleCardClick(bundle)}>
                            {/* MODIFICADO: Reemplazar img con LazyImage */}
                            <LazyImage 
                              src={getImageUrl(bundle.image)} 
                              alt={bundle.name}
                              skeletonClassName="skeleton-card"
                            />
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

            {/* Eco Blog - MODIFICADO: Usar LazyImage */}
            <section className="eco-blog-section">
                <div className="eco-blog-header">
                    <h2 className="eco-blog-title">Eco Blog <span className="eco-blog-sub">(Tips for a sustainable life)</span></h2>
                </div>
                <div className="eco-blog-scroll">
                    {blogs.map((blog) => (
                        <Link to={`/eco-blog/${blog.slug}`} className="eco-blog-card" key={blog._id}>
                            {/* MODIFICADO: Reemplazar img con LazyImage */}
                            <LazyImage 
                              src={getImageUrl(blog.image)} 
                              alt={blog.title}
                              skeletonClassName="skeleton-blog"
                            />
                        </Link>
                    ))}
                </div>
            </section>

            {/* Eco Bottles - MODIFICADO: Usar LazyImage */}
            <section className="eco-bottles-section">
                <div className="eco-bottles-header">
                    <h2 className="eco-bottles-title">Eco Bottles</h2>
                </div>
                <div className="eco-bottles-scroll">
                    {ecoBottles.map((bottle) => (
                        <div className="eco-bottle-card" key={bottle._id} onClick={() => handleCardClick(bottle)}>
                            {/* MODIFICADO: Reemplazar img con LazyImage */}
                            <LazyImage 
                              src={getImageUrl(bottle.image)} 
                              alt={bottle.name}
                              skeletonClassName="skeleton-card"
                            />
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

            {/* Eco Souvenirs - MODIFICADO: Usar LazyImage */}
            <section className="eco-souvenirs-section">
                <div className="eco-souvenirs-header">
                    <h2 className="eco-souvenirs-title">Eco Souvenirs</h2>
                </div>
                {ecoSouvenirs[0] && (
                  <Link to="/contact" className="eco-souvenir-image-container">
                      {/* MODIFICADO: Reemplazar img con LazyImage */}
                      <LazyImage 
                        src={getImageUrl(ecoSouvenirs[0].image)} 
                        alt={ecoSouvenirs[0].name}
                        skeletonClassName="skeleton-banner"
                      />
                  </Link>
                )}
            </section>

            {/* Our Store - MODIFICADO: Usar LazyImage */}
            <section className="our-store-section">
                <div className="our-store-header">
                    <h2 className="our-store-title">Our Store</h2>
                </div>
                {ourStore[0] && (
                  <Link to="/our-store" className="our-store-image-container">
                      {/* MODIFICADO: Reemplazar img con LazyImage */}
                      <LazyImage 
                        src={getImageUrl(ourStore[0].image)} 
                        alt={ourStore[0].title}
                        skeletonClassName="skeleton-banner"
                      />
                  </Link>
                )}
            </section>

            {/* NavBar inferior */}
            <nav className="bottom-navbar">
                <a href="#top" className="nav-icon" aria-label="Home">
                    <img src="/HomeIcon.png" alt="Home" />
                </a>
                <Link to="/search" className="nav-icon" aria-label="Search">
                    <img src="/SearchIcon.png" alt="Search" />
                </Link>
                <button onClick={handleAvatarClick} className="nav-icon avatar-button" aria-label="Avatar">
                    <img src="/AvatarIcon.png" alt="Avatar" />
                </button>
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

