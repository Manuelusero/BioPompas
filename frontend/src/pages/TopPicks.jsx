import "./TopPicks.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const TopPicks = () => {
    const [topPicks, setTopPicks] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:5001/api/top-picks")
            .then(res => setTopPicks(res.data))
            .catch(() => setTopPicks([]));
    }, []);
    return (
        <div className="toppicks-page">
            <div className="toppicks-header">
                <Link to="/home" className="toppicks-back"><span className="arrow-icon">&larr;</span></Link>
                <h2 className="toppicks-title">Top Picks</h2>
                <img src="/src/assets/Icons/Cart.svg" alt="Carrito" className="toppicks-cart" />
            </div>
            <div className="toppicks-list">
                {topPicks.map((product) => (
                    <div className="toppick-card" key={product.id}>
                        <img src={`http://localhost:5001${product.image}`} alt={product.name} />
                        <div className="toppick-name">{product.name}</div>
                        <div className="toppick-price">{product.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</div>
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

export default TopPicks;
