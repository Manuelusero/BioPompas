import { useEffect, useState } from "react";

const Products = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/products`);
                console.log('Products response status:', response.status);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('Response is not JSON');
                }
                
                const data = await response.json();
                console.log('Products data:', data);
                setProducts(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error al obtener productos:", error);
                setProducts([]);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div>

            <ul>
                {products.map(product => (
                    <li key={product._id}>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p>Precio: ${product.price}</p>
                        <img src={`${import.meta.env.VITE_APP_API_URL.replace('/api', '')}${product.image}`} alt={product.name} width="100" />
                    </li>
                ))}
            </ul>
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

export default Products;
