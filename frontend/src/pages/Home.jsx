import { useEffect, useState } from "react";
import "swiper/css";
import { Link } from "react-router-dom";
import { useCart } from "../api/CartContext";
import BottomSheetProductFull from "../components/BottomSheetProductFull";
import { getImageUrl, getApiUrl } from '../utils/api.js';
import './Home.css';

const Home = () => {
    const { cartCount, addToCart } = useCart();
    const [products, setProducts] = useState([]);
    // const [promotions, setPromotions] = useState([]);
    // const [topPicks, setTopPicks] = useState([]);
    // const [categories, setCategories] = useState([]);
    // const [giftBundles, setGiftBundles] = useState([]);
    // const [blogs, setBlogs] = useState([]);
    // const [ecoBottles, setEcoBottles] = useState([]);
    // const [ecoSouvenirs, setEcoSouvenirs] = useState([]);
    // const [ourStore, setOurStore] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
    const [bottomSheetCount, setBottomSheetCount] = useState(1);

    useEffect(() => {
        console.log('🚀 Home component mounting...');
        console.log('API URL:', getApiUrl());
        
        const loadData = async () => {
            try {
                setLoading(true);
                
                // Simplified fetch - just try to get products first
                console.log('Fetching products...');
                const response = await fetch(`${getApiUrl()}/products`);
                console.log('Products response:', response);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('Products data:', data);
                    setProducts(Array.isArray(data) ? data : []);
                } else {
                    console.error('Products fetch failed:', response.status);
                }
                
            } catch (error) {
                console.error("Error loading data:", error);
                setError("Error cargando datos");
            } finally {
                setLoading(false);
            }
        };

        loadData();
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
        try {
            await addToCart(product, count);
            setBottomSheetOpen(false);
            setSelectedProductId(null);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    if (loading) {
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
            
            <p>Productos encontrados: {products.length}</p>
            
            {/* Simple product list for testing */}
            {products.length > 0 && (
                <div>
                    <h3>Primeros 3 productos:</h3>
                    {products.slice(0, 3).map((product) => (
                        <div key={product._id} onClick={() => handleCardClick(product)} style={{ 
                            border: '1px solid #ccc', 
                            margin: '10px', 
                            padding: '10px',
                            cursor: 'pointer'
                        }}>
                            <h4>{product.name}</h4>
                            <p>€{product.price}</p>
                            {product.image && (
                                <img 
                                    src={getImageUrl(product.image)} 
                                    alt={product.name} 
                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                    onError={(e) => {
                                        console.log('Image load error:', e.target.src);
                                        e.target.style.display = 'none';
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}

            <BottomSheetProductFull
                productId={selectedProductId}
                products={products}
                open={bottomSheetOpen}
                onClose={handleCloseBottomSheet}
                onAdd={handleAddToCart}
                count={bottomSheetCount}
                setCount={setBottomSheetCount}
            />

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
        </div>
    );
};

export default Home;
    
