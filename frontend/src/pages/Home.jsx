import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "./Home.css";

const Home = () => {
    const [products, setProducts] = useState([]);
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
        fetchProducts();
    }, []);

    return (
        <div>
            <h1>Logo Biopompas</h1>
            <h2>DEALS OF THE WEEK</h2>

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
                        <SwiperSlide key={product._id}>
                            <div className="card">
                                <img src={product.image} />
                                <h3>{product.name}</h3>
                                <p>{product.description}</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
};

export default Home;
